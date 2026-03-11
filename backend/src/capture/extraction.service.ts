import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * AI-powered content extraction service.
 * MVP: Uses heuristic extraction. Will integrate with OpenAI/Ollama in Phase 2.
 */
@Injectable()
export class ExtractionService {
  private readonly logger = new Logger(ExtractionService.name);

  constructor(private readonly configService: ConfigService) {}

  async extract(request: { url?: string; content?: string; captureType: string }) {
    this.logger.log(`Extracting metadata for ${request.captureType}`);

    // MVP: Heuristic extraction based on content type
    const extraction = await this.heuristicExtract(request);

    return {
      success: true,
      extraction,
    };
  }

  async suggestTags(content: string) {
    // MVP: Simple keyword-based tag extraction
    // Phase 2: Will use LLM for semantic tagging
    const tags = this.extractKeywordTags(content);

    return {
      suggestions: tags.map((label) => ({
        label,
        category: 'topic' as const,
        confidence: 0.7,
        source: 'ai' as const,
      })),
    };
  }

  private async heuristicExtract(request: {
    url?: string;
    content?: string;
    captureType: string;
  }) {
    const suggestedTags = this.extractKeywordTags(request.content || '');
    const contentType = this.detectContentType(request.url || '', request.captureType);

    return {
      suggestedTitle: this.generateTitle(request),
      suggestedDescription: this.generateDescription(request.content || ''),
      suggestedTags: suggestedTags.map((label) => ({
        label,
        category: 'topic' as const,
        confidence: 0.7,
        source: 'ai' as const,
      })),
      extractedMetadata: {
        contentType,
        language: 'en',
        domains: this.detectDomains(request.content || ''),
      },
      detectedType: request.captureType,
      confidence: 0.6,
    };
  }

  private generateTitle(request: {
    url?: string;
    content?: string;
    captureType: string;
  }): string {
    if (request.url) {
      try {
        const url = new URL(request.url);
        const path = url.pathname.replace(/\//g, ' ').trim();
        if (path) return `${url.hostname} - ${path}`;
        return url.hostname;
      } catch {
        // Not a valid URL
      }
    }
    if (request.content) {
      const firstLine = request.content.split('\n')[0].trim();
      if (firstLine.length > 0 && firstLine.length <= 100) return firstLine;
      if (firstLine.length > 100) return firstLine.substring(0, 97) + '...';
    }
    return `${request.captureType} capture`;
  }

  private generateDescription(content: string): string {
    if (!content) return '';
    const cleaned = content.replace(/\s+/g, ' ').trim();
    if (cleaned.length <= 200) return cleaned;
    return cleaned.substring(0, 197) + '...';
  }

  /**
   * MVP keyword extraction - extracts meaningful words as tags.
   * Will be replaced with NER + LLM-based extraction.
   */
  private extractKeywordTags(content: string): string[] {
    if (!content) return [];

    // Common stop words to filter out
    const stopWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
      'it', 'its', 'not', 'no', 'from', 'as', 'if', 'then', 'than',
      'so', 'very', 'just', 'about', 'up', 'out', 'all', 'also', 'how',
      'more', 'some', 'any', 'each', 'which', 'what', 'when', 'where',
      'who', 'whom', 'why', 'into', 'over', 'after', 'before', 'between',
    ]);

    const words = content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !stopWords.has(w));

    // Count word frequencies
    const freq = new Map<string, number>();
    for (const word of words) {
      freq.set(word, (freq.get(word) || 0) + 1);
    }

    // Return top keywords by frequency
    return Array.from(freq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([word]) => word);
  }

  private detectContentType(url: string, captureType: string): string {
    if (captureType === 'video' || url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'video';
    }
    if (captureType === 'code') return 'code';
    if (captureType === 'image') return 'image';
    if (url.includes('github.com')) return 'repository';
    if (url.includes('stackoverflow.com')) return 'q&a';
    if (url.includes('arxiv.org')) return 'paper';
    if (url.includes('medium.com') || url.includes('dev.to') || url.includes('blog')) {
      return 'article';
    }
    if (url.includes('docs.') || url.includes('documentation')) return 'documentation';
    return 'webpage';
  }

  private detectDomains(content: string): string[] {
    const domains: string[] = [];
    const contentLower = content.toLowerCase();

    const domainKeywords: Record<string, string[]> = {
      'technology': ['software', 'programming', 'code', 'developer', 'api', 'framework'],
      'science': ['research', 'study', 'experiment', 'hypothesis', 'data'],
      'design': ['ui', 'ux', 'design', 'layout', 'typography', 'color'],
      'business': ['revenue', 'market', 'startup', 'company', 'investment'],
      'ai-ml': ['machine learning', 'artificial intelligence', 'neural', 'model', 'training'],
    };

    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some((kw) => contentLower.includes(kw))) {
        domains.push(domain);
      }
    }

    return domains;
  }
}
