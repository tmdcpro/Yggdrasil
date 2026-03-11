import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CapturePayloadDto, UpdateNodeDto } from './capture.dto';
import { ExtractionService } from './extraction.service';

/**
 * In-memory store for MVP. Will be replaced with Neo4j + PostgreSQL.
 */
interface StoredNode {
  id: string;
  type: string;
  title: string;
  content: string;
  sourceUrl: string;
  tags: string[];
  metadata: Record<string, unknown>;
  created: string;
  modified: string;
}

interface StoredTag {
  id: string;
  label: string;
  source: 'ai' | 'manual';
  category: string;
  usageCount: number;
}

@Injectable()
export class CaptureService {
  private readonly logger = new Logger(CaptureService.name);
  private nodes: Map<string, StoredNode> = new Map();
  private tags: Map<string, StoredTag> = new Map();

  constructor(private readonly extractionService: ExtractionService) {}

  async capture(payload: CapturePayloadDto) {
    this.logger.log(`Capturing ${payload.captureType} from ${payload.sourceUrl}`);

    const nodeId = uuidv4();
    const now = new Date().toISOString();

    // Run AI extraction if enabled (default: true)
    let extraction = null;
    const enableAi = payload.options?.enableAiExtraction !== false;
    if (enableAi) {
      try {
        extraction = await this.extractionService.extract({
          url: payload.captureType === 'url' ? payload.content : payload.sourceUrl,
          content: payload.content,
          captureType: payload.captureType,
        });
      } catch (error) {
        this.logger.warn('AI extraction failed, continuing without it', error);
      }
    }

    // Build the node
    const title =
      payload.options?.title ||
      extraction?.extraction?.suggestedTitle ||
      payload.sourceTitle ||
      'Untitled Capture';

    const aiTags = extraction?.extraction?.suggestedTags?.map(
      (t: { label: string }) => t.label,
    ) || [];
    const userTags = payload.options?.tags || [];
    const allTags = [...new Set([...userTags, ...aiTags])];

    const node: StoredNode = {
      id: nodeId,
      type: payload.captureType,
      title,
      content: payload.content,
      sourceUrl: payload.sourceUrl,
      tags: allTags,
      metadata: {
        captureType: payload.captureType,
        sourceTitle: payload.sourceTitle,
        context: payload.context || {},
        extraction: extraction?.extraction || null,
        capturedAt: payload.capturedAt || now,
      },
      created: now,
      modified: now,
    };

    this.nodes.set(nodeId, node);

    // Update tag counts
    for (const tag of allTags) {
      this.addOrUpdateTag(tag, aiTags.includes(tag) ? 'ai' : 'manual');
    }

    this.logger.log(`Captured node ${nodeId}: "${title}" with ${allTags.length} tags`);

    return {
      success: true,
      result: {
        nodeId,
        node,
        extraction: extraction?.extraction || null,
        edges: [],
        status: 'success',
      },
    };
  }

  async getRecent(limit: number) {
    const allNodes = Array.from(this.nodes.values());
    allNodes.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );
    return {
      items: allNodes.slice(0, limit),
      total: allNodes.length,
    };
  }

  async listNodes(query: {
    page: number;
    pageSize: number;
    type?: string;
    search?: string;
    tags?: string[];
  }) {
    let nodes = Array.from(this.nodes.values());

    // Filter by type
    if (query.type) {
      nodes = nodes.filter((n) => n.type === query.type);
    }

    // Filter by search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      nodes = nodes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.content.toLowerCase().includes(searchLower),
      );
    }

    // Filter by tags
    if (query.tags && query.tags.length > 0) {
      nodes = nodes.filter((n) =>
        query.tags!.some((tag) => n.tags.includes(tag)),
      );
    }

    // Sort by created desc
    nodes.sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime(),
    );

    const total = nodes.length;
    const start = (query.page - 1) * query.pageSize;
    const items = nodes.slice(start, start + query.pageSize);

    return {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      hasMore: start + query.pageSize < total,
    };
  }

  async getNode(id: string) {
    const node = this.nodes.get(id);
    if (!node) {
      return { error: 'Node not found' };
    }
    return { node, edges: [], relatedNodes: [] };
  }

  async updateNode(id: string, update: UpdateNodeDto) {
    const node = this.nodes.get(id);
    if (!node) {
      return { success: false, error: 'Node not found' };
    }

    if (update.title !== undefined) node.title = update.title;
    if (update.tags !== undefined) node.tags = update.tags;
    if (update.metadata !== undefined) {
      node.metadata = { ...node.metadata, ...update.metadata };
    }
    node.modified = new Date().toISOString();
    this.nodes.set(id, node);

    return { success: true, node };
  }

  async listTags() {
    return {
      items: Array.from(this.tags.values()).sort(
        (a, b) => b.usageCount - a.usageCount,
      ),
      total: this.tags.size,
    };
  }

  async suggestTags(content: string, _existingTags?: string[]) {
    // Delegate to extraction service for AI suggestions
    const result = await this.extractionService.suggestTags(content);
    return result;
  }

  private addOrUpdateTag(label: string, source: 'ai' | 'manual') {
    const existing = this.tags.get(label);
    if (existing) {
      existing.usageCount++;
      this.tags.set(label, existing);
    } else {
      this.tags.set(label, {
        id: uuidv4(),
        label,
        source,
        category: 'topic',
        usageCount: 1,
      });
    }
  }
}
