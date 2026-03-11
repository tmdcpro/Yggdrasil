/**
 * API request/response types
 */

import type { AnyNode } from './nodes';
import type { Edge } from './edges';
import type { CapturePayload, CaptureResult, ExtractionResult, SuggestedTag } from './capture';
import type { Tag } from './tags';

/**
 * Generic paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * POST /api/capture
 */
export interface CaptureRequest {
  payload: CapturePayload;
}

export interface CaptureResponse {
  success: boolean;
  result: CaptureResult;
}

/**
 * POST /api/capture/extract
 */
export interface ExtractRequest {
  url?: string;
  content?: string;
  captureType: string;
}

export interface ExtractResponse {
  success: boolean;
  extraction: ExtractionResult;
}

/**
 * GET /api/nodes
 */
export interface NodesListQuery {
  page?: number;
  pageSize?: number;
  type?: string;
  tags?: string[];
  search?: string;
  sortBy?: 'created' | 'modified' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export type NodesListResponse = PaginatedResponse<AnyNode>;

/**
 * GET /api/nodes/:id
 */
export interface NodeDetailResponse {
  node: AnyNode;
  edges: Edge[];
  relatedNodes: AnyNode[];
}

/**
 * PUT /api/nodes/:id
 */
export interface UpdateNodeRequest {
  title?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface UpdateNodeResponse {
  success: boolean;
  node: AnyNode;
}

/**
 * POST /api/tags/suggest
 */
export interface TagSuggestRequest {
  content: string;
  existingTags?: string[];
}

export interface TagSuggestResponse {
  suggestions: SuggestedTag[];
}

/**
 * GET /api/tags
 */
export type TagsListResponse = PaginatedResponse<Tag>;
