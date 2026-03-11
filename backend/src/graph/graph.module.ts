import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';

/**
 * Graph module - handles Neo4j graph database operations.
 * MVP: Stub implementation. Will connect to Neo4j in Phase 1.2.
 */
@Module({
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}
