/**
 * Base node interface - all graph nodes extend this
 */
export interface BaseNode {
  id: string;
  type: NodeType;
  title: string;
  created: string; // ISO 8601
  modified: string; // ISO 8601
  tags: string[];
  metadata: Record<string, unknown>;
}

export type NodeType =
  | 'url'
  | 'document'
  | 'media'
  | 'text'
  | 'concept'
  | 'tag'
  | 'collection';

/**
 * A captured URL / bookmark
 */
export interface URLNode extends BaseNode {
  type: 'url';
  url: string;
  description?: string;
  screenshot?: string;
  favicon?: string;
  author?: string;
  publishedDate?: string;
  siteName?: string;
  contentType?: string; // e.g., "article", "video", "repository"
}

/**
 * A captured document / note
 */
export interface DocumentNode extends BaseNode {
  type: 'document';
  content: string;
  format: 'markdown' | 'html' | 'text';
  summary?: string;
  wordCount?: number;
  language?: string;
}

/**
 * A captured media item (image, video, audio)
 */
export interface MediaNode extends BaseNode {
  type: 'media';
  mediaType: 'image' | 'video' | 'audio';
  url: string;
  sourceUrl?: string; // original page URL
  thumbnail?: string;
  duration?: number; // seconds, for video/audio
  dimensions?: { width: number; height: number };
  altText?: string;
  fileSize?: number; // bytes
  mimeType?: string;
}

/**
 * A captured text selection / snippet
 */
export interface TextNode extends BaseNode {
  type: 'text';
  content: string;
  sourceUrl?: string;
  sourceTitle?: string;
  selectionContext?: string; // surrounding text for context
  format: 'plain' | 'code' | 'quote';
  language?: string; // programming language for code
}

/**
 * A concept / topic in the knowledge graph
 */
export interface ConceptNode extends BaseNode {
  type: 'concept';
  label: string;
  definition?: string;
  domain: string;
  hierarchy: string[]; // path from root, e.g., ["Science", "CS", "ML"]
  aliases: string[];
  confidence: number; // AI confidence score 0-1
}

/**
 * A tag node
 */
export interface TagNode extends BaseNode {
  type: 'tag';
  label: string;
  source: 'ai' | 'manual' | 'imported';
  category: 'topic' | 'entity' | 'sentiment' | 'domain' | 'custom';
  weight: number; // grounding score 0-1
  color?: string;
}

/**
 * A collection / folder of nodes
 */
export interface CollectionNode extends BaseNode {
  type: 'collection';
  description?: string;
  icon?: string;
  nodeCount?: number;
}

export type AnyNode =
  | URLNode
  | DocumentNode
  | MediaNode
  | TextNode
  | ConceptNode
  | TagNode
  | CollectionNode;
