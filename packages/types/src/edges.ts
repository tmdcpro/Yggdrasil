/**
 * Base edge interface - all graph edges extend this
 */
export interface BaseEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight?: number;
  created: string; // ISO 8601
  metadata: Record<string, unknown>;
}

export type EdgeType =
  | 'references'
  | 'contains'
  | 'similar_to'
  | 'derived_from'
  | 'temporal_next'
  | 'belongs_to'
  | 'is_a'
  | 'part_of'
  | 'tagged_with'
  | 'maps_to'
  | 'contradicts'
  | 'supports'
  | 'instance_of';

export interface Edge extends BaseEdge {
  label?: string;
}
