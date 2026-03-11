/**
 * Tag and taxonomy types for the knowledge graph
 */

export interface Tag {
  id: string;
  label: string;
  source: 'ai' | 'manual' | 'imported';
  category: TagCategory;
  weight: number;
  color?: string;
  usageCount: number;
}

export type TagCategory =
  | 'topic'
  | 'entity'
  | 'sentiment'
  | 'domain'
  | 'custom';

/**
 * A taxonomy hierarchy node
 */
export interface TaxonomyNode {
  id: string;
  label: string;
  parentId?: string;
  children: TaxonomyNode[];
  domain: string;
  depth: number;
}

/**
 * An ontology class mapping
 */
export interface OntologyMapping {
  id: string;
  conceptLabel: string;
  namespace: string; // e.g., "schema.org", "dbpedia"
  classUri: string;
  properties: OntologyProperty[];
}

export interface OntologyProperty {
  name: string;
  type: string;
  description?: string;
  required: boolean;
}
