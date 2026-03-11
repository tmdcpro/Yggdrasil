/**
 * Types for the capture/extraction pipeline.
 * Used by the browser extension, backend API, and extraction service.
 */

/**
 * What kind of content is being captured
 */
export type CaptureType =
  | 'url'         // A webpage URL
  | 'text'        // Selected text
  | 'image'       // An image (from page or file)
  | 'link'        // A hyperlink
  | 'file'        // A file (PDF, etc.)
  | 'screenshot'  // A screenshot capture
  | 'code'        // Code snippet
  | 'video'       // Video URL (YouTube, etc.)
  | 'mixed';      // Multiple types combined

/**
 * Raw capture payload from the browser extension
 */
export interface CapturePayload {
  /** What type of content is being captured */
  captureType: CaptureType;
  /** The primary content (URL, text, image data URL, etc.) */
  content: string;
  /** Source page URL where capture originated */
  sourceUrl: string;
  /** Source page title */
  sourceTitle: string;
  /** Timestamp of capture */
  capturedAt: string; // ISO 8601
  /** Additional context from the page */
  context: CaptureContext;
  /** User-specified options */
  options?: CaptureOptions;
}

/**
 * Contextual information from the source page
 */
export interface CaptureContext {
  /** Selected text (if any) */
  selectedText?: string;
  /** Surrounding text around selection */
  surroundingText?: string;
  /** Link URL (if right-clicked on a link) */
  linkUrl?: string;
  /** Link text */
  linkText?: string;
  /** Image URL (if right-clicked on an image) */
  imageUrl?: string;
  /** Image alt text */
  imageAlt?: string;
  /** Video URL (if applicable) */
  videoUrl?: string;
  /** Page meta tags */
  pageMeta?: PageMetadata;
  /** CSS selector path to the clicked element */
  elementPath?: string;
}

/**
 * Page metadata extracted from meta tags, Open Graph, etc.
 */
export interface PageMetadata {
  title?: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  siteName?: string;
  favicon?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  keywords?: string[];
  language?: string;
}

/**
 * User preferences for this capture
 */
export interface CaptureOptions {
  /** User-specified title override */
  title?: string;
  /** User-specified tags */
  tags?: string[];
  /** Target collection to add to */
  collectionId?: string;
  /** Whether to run AI extraction */
  enableAiExtraction?: boolean;
  /** Which metadata fields to include */
  includeFields?: string[];
  /** Which metadata fields to exclude */
  excludeFields?: string[];
}

/**
 * Result of AI extraction / enrichment
 */
export interface ExtractionResult {
  /** Auto-generated title */
  suggestedTitle: string;
  /** Auto-generated description/summary */
  suggestedDescription: string;
  /** AI-suggested tags */
  suggestedTags: SuggestedTag[];
  /** Extracted metadata */
  extractedMetadata: ExtractedMetadata;
  /** Detected content type */
  detectedType: CaptureType;
  /** Confidence score of the extraction overall */
  confidence: number;
}

/**
 * An AI-suggested tag with confidence
 */
export interface SuggestedTag {
  label: string;
  category: 'topic' | 'entity' | 'sentiment' | 'domain' | 'custom';
  confidence: number;
  source: 'ai';
}

/**
 * Metadata extracted by AI from the content
 */
export interface ExtractedMetadata {
  /** Detected author */
  author?: string;
  /** Detected publication date */
  publishedDate?: string;
  /** Detected language */
  language?: string;
  /** Detected content type (article, tutorial, documentation, etc.) */
  contentType?: string;
  /** Key entities extracted */
  entities?: ExtractedEntity[];
  /** Summary */
  summary?: string;
  /** Reading time estimate in minutes */
  readingTime?: number;
  /** Sentiment (-1 to 1) */
  sentiment?: number;
  /** Detected topics/domains */
  domains?: string[];
}

/**
 * An entity extracted from content
 */
export interface ExtractedEntity {
  name: string;
  type: 'person' | 'organization' | 'location' | 'technology' | 'concept' | 'other';
  confidence: number;
}

/**
 * The full capture result after processing
 */
export interface CaptureResult {
  /** The created node ID */
  nodeId: string;
  /** The created node */
  node: import('./nodes').AnyNode;
  /** AI extraction results (if enabled) */
  extraction?: ExtractionResult;
  /** Any edges created */
  edges: import('./edges').Edge[];
  /** Processing status */
  status: 'success' | 'partial' | 'failed';
  /** Error message if failed */
  error?: string;
}
