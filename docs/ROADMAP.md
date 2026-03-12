# Yggdrasil Development Roadmap and Task Queue

> **How to use this document**: This is the living task tracker for Yggdrasil development. Each task has a checkbox indicating completion status. Update checkboxes as work progresses. For the full product requirements, see [PRD.md](./PRD.md).

## Current Status

| Phase | Status | Progress |
|-------|--------|----------|
| Phase 1: Foundation (Months 1-3) | **In Progress** | Sprint 1.1 complete |
| Phase 2: Enhanced Features (Months 4-6) | Not Started | -- |
| Phase 3: Production Ready (Months 7-9) | Not Started | -- |
| Phase 4: Ecosystem Growth (Months 10-12) | Not Started | -- |

---

## Phase 1: Foundation (Months 1-3)

### Sprint 1.1: Project Setup and Core Infrastructure (Weeks 1-2)

#### 1.1.1 Project Setup
- [x] Initialize monorepo with pnpm workspaces
- [x] Configure TypeScript strict mode across all packages
- [x] Set up ESLint for frontend and backend
- [x] Create shared types package (@yggdrasil/types)
- [x] Set up frontend (React 18 + Vite + Tailwind CSS)
- [x] Set up backend (NestJS with Swagger/OpenAPI)
- [x] Set up extraction service (Express.js)
- [x] Set up semantic service (Express.js)
- [x] Create Chrome extension scaffold (Manifest V3)
- [x] Document multi-stream development strategy (EXPERIMENTS.md)
- [x] Track pnpm-lock.yaml for reproducible installs

#### 1.1.2 Security Hardening
- [x] Add SSRF protection to extraction service (localhost, private networks, IPv6)
- [x] Block full 127.0.0.0/8 loopback range
- [x] Validate redirects to prevent SSRF bypass
- [x] Add XSS prevention in Chrome extension (popup.js, content.js)
- [x] Fix API client header merge vulnerability
- [x] Return proper HTTP 404 for missing resources
- [x] Add query parameter type coercion
- [x] Fix false success display on failed capture (CaptureReview)

#### 1.1.3 Core UI Shell
- [x] Create application layout with sidebar navigation
- [x] Build Dashboard view with stats and recent captures
- [x] Build Capture form with content type selector
- [x] Build Graph view placeholder with node sidebar
- [x] Set up Zustand state management with API integration
- [x] Implement dark theme

### Sprint 1.2: Graph Engine Foundation (Weeks 3-4)

#### 1.2.1 Database Infrastructure
- [ ] Set up Neo4j connection and driver
- [ ] Create graph schema (node types, edge types, constraints)
- [ ] Implement Neo4j repository layer
- [ ] Add PostgreSQL for metadata storage
- [ ] Create database migration system
- [ ] Set up Redis for caching layer
- [ ] Write database seed scripts

#### 1.2.2 Graph API
- [ ] Implement full CRUD for nodes (create, read, update, delete)
- [ ] Implement full CRUD for edges/relationships
- [ ] Add graph traversal endpoints (BFS/DFS)
- [ ] Add node search with filters (type, tags, date range)
- [ ] Implement pagination for large result sets
- [ ] Add bulk operations (batch create/delete)
- [ ] Write API integration tests

#### 1.2.3 Graph Visualization
- [ ] Integrate Cytoscape.js for 2D graph rendering
- [ ] Implement force-directed layout
- [ ] Add node click/hover interactions
- [ ] Implement pan, zoom, and selection
- [ ] Add node type visual differentiation (icons, colors)
- [ ] Connect live data from backend API
- [ ] Add mini-map for navigation

### Sprint 1.3: Capture Pipeline (Weeks 5-6)

#### 1.3.1 Chrome Extension Enhancement
- [ ] Add right-click context menu for all capture types
- [ ] Implement text selection capture
- [ ] Implement image capture (right-click on images)
- [ ] Implement link capture (right-click on links)
- [ ] Add sidebar panel for rich capture without leaving page
- [ ] Implement quick capture (one-click with AI defaults)
- [ ] Add capture queue for offline support
- [ ] Add extension options page (backend URL, preferences)

#### 1.3.2 Extraction Service Enhancement
- [ ] Add full-page content extraction (main text, images)
- [ ] Implement structured data extraction (JSON-LD, microdata)
- [ ] Add screenshot capture (Playwright integration)
- [ ] Implement YouTube metadata extraction (title, description, thumbnail)
- [ ] Add Twitter/X content extraction
- [ ] Implement GitHub repository metadata extraction
- [ ] Add rate limiting and request queuing

#### 1.3.3 Semantic Service -- Real AI Integration
- [ ] Integrate OpenAI API for entity extraction
- [ ] Integrate Ollama for local model fallback
- [ ] Implement keyword extraction from content
- [ ] Add topic classification with confidence scores
- [ ] Implement language detection
- [ ] Build fallback chain (Cloud -> Local -> Rule-based)
- [ ] Add embedding generation for semantic similarity

---

## Phase 2: Enhanced Features (Months 4-6)

### Sprint 2.1: Advanced Visualization (Weeks 7-8)

#### 2.1.1 Graph View Enhancements
- [ ] Add hierarchical layout option
- [ ] Add circular layout option
- [ ] Implement node filtering by type, tag, date
- [ ] Implement edge filtering by relationship type and weight
- [ ] Add focus mode for subgraph exploration
- [ ] Implement node grouping/clustering
- [ ] Add graph search with highlight

#### 2.1.2 Additional View Types
- [ ] Build Timeline view (chronological captures)
- [ ] Build Table view (spreadsheet-like with sorting/filtering)
- [ ] Build Kanban view (board organized by tags/status)
- [ ] Build Hierarchy view (tree based on taxonomy)
- [ ] Implement view switcher in UI
- [ ] Add view persistence (remember last view per session)

#### 2.1.3 3D Graph View
- [ ] Integrate Three.js / React Three Fiber
- [ ] Implement 3D force-directed layout
- [ ] Add 3D navigation (orbit, pan, zoom)
- [ ] Implement node labels in 3D space
- [ ] Add 2D/3D toggle in graph view
- [ ] Optimize rendering for 1000+ nodes

### Sprint 2.2: Semantic Intelligence (Weeks 9-10)

#### 2.2.1 Ontology System
- [ ] Design ontology data model (classes, properties, instances)
- [ ] Build ontology editor UI
- [ ] Implement Dublin Core ontology mapping
- [ ] Implement Schema.org ontology mapping
- [ ] Add custom ontology creation
- [ ] Implement property inheritance through ontology hierarchy

#### 2.2.2 Taxonomy System
- [ ] Design taxonomy data model (hierarchical categories)
- [ ] Build taxonomy editor UI (drag-and-drop tree)
- [ ] Implement auto-classification into taxonomies
- [ ] Add taxonomy import/export
- [ ] Support multiple simultaneous taxonomies
- [ ] Implement taxonomy-based navigation

#### 2.2.3 Relationship Inference
- [ ] Implement semantic similarity calculation (embeddings)
- [ ] Build relationship suggestion engine
- [ ] Add "similar nodes" panel in node detail view
- [ ] Implement automatic relationship creation (with confidence threshold)
- [ ] Add relationship type inference
- [ ] Build knowledge gap detection

### Sprint 2.3: Search and Discovery (Weeks 11-12)

#### 2.3.1 Full-Text Search
- [ ] Set up Elasticsearch or MeiliSearch
- [ ] Index all node content
- [ ] Implement search results UI with highlighting
- [ ] Add faceted search (filter by type, tags, date, source)
- [ ] Implement search suggestions / autocomplete
- [ ] Add saved searches

#### 2.3.2 Semantic Search
- [ ] Set up ChromaDB for vector storage
- [ ] Generate embeddings for all nodes
- [ ] Implement "find similar" feature
- [ ] Add natural language query support
- [ ] Implement search-by-example (select a node, find similar)

#### 2.3.3 Command Palette
- [ ] Build Cmd+K command palette component
- [ ] Add universal search integration
- [ ] Implement quick actions (create node, navigate, filter)
- [ ] Add keyboard shortcuts system
- [ ] Implement customizable shortcuts

---

## Phase 3: Production Ready (Months 7-9)

### Sprint 3.1: Data Persistence and Reliability (Weeks 13-14)

#### 3.1.1 Database Hardening
- [ ] Implement database connection pooling
- [ ] Add automatic retry with backoff
- [ ] Create backup/restore system
- [ ] Implement data migration tooling
- [ ] Add database health monitoring
- [ ] Set up automatic backups schedule

#### 3.1.2 Error Handling and Resilience
- [ ] Implement circuit breaker for external services
- [ ] Add graceful degradation for all AI features
- [ ] Implement request retry with exponential backoff
- [ ] Add comprehensive error logging
- [ ] Build error recovery UI (retry failed operations)
- [ ] Implement offline mode for Chrome extension

#### 3.1.3 Performance Optimization
- [ ] Add query result caching (Redis)
- [ ] Implement graph virtualization for large graphs
- [ ] Add lazy loading for node properties
- [ ] Optimize bundle size (code splitting, tree shaking)
- [ ] Add loading states and skeleton screens
- [ ] Implement request deduplication

### Sprint 3.2: Import/Export and Portability (Weeks 15-16)

#### 3.2.1 Export System
- [ ] Export to JSON (full graph with metadata)
- [ ] Export to CSV (nodes and relationships separately)
- [ ] Export to Markdown (knowledge base format)
- [ ] Export to JSON-LD / RDF (semantic web format)
- [ ] Add selective export (filtered subsets)
- [ ] Implement scheduled auto-export

#### 3.2.2 Import System
- [ ] Import from browser bookmarks (Chrome, Firefox)
- [ ] Import from Obsidian (markdown + links)
- [ ] Import from Notion (API integration)
- [ ] Import from Roam Research (JSON export)
- [ ] Import from OPML (RSS/feed lists)
- [ ] Add duplicate detection during import

### Sprint 3.3: Plugin System Foundation (Weeks 17-18)

#### 3.3.1 Plugin Architecture
- [ ] Design plugin API and extension points
- [ ] Implement plugin loader and lifecycle management
- [ ] Add plugin configuration system
- [ ] Implement plugin sandboxing
- [ ] Build plugin development documentation
- [ ] Create plugin template/starter kit

#### 3.3.2 Built-in Plugins
- [ ] YouTube extractor plugin (videos, playlists, transcripts)
- [ ] Twitter/X extractor plugin (threads, profiles)
- [ ] GitHub extractor plugin (repos, issues, code)
- [ ] Academic paper extractor (arXiv, Semantic Scholar)
- [ ] Reddit extractor plugin (posts, comments)
- [ ] Generic CSS/XPath extractor plugin

---

## Phase 4: Ecosystem Growth (Months 10-12)

### Sprint 4.1: Custom Views System (Weeks 19-20)

#### 4.1.1 View Configuration Engine
- [ ] Design view configuration schema
- [ ] Implement view builder UI
- [ ] Add filter, sort, and group configuration
- [ ] Implement saved views with shareable URLs
- [ ] Add view templates for common patterns
- [ ] Support plugin-based custom view renderers

#### 4.1.2 Dashboard Customization
- [ ] Add customizable dashboard widgets
- [ ] Implement drag-and-drop widget arrangement
- [ ] Build tag cloud widget
- [ ] Build activity feed widget
- [ ] Build stats/metrics widgets
- [ ] Add widget configuration panels

### Sprint 4.2: Collaboration Features (Weeks 21-22)

#### 4.2.1 Multi-User Support
- [ ] Implement user authentication (OAuth2)
- [ ] Add role-based access control
- [ ] Implement graph sharing (read/write permissions)
- [ ] Add collaborative editing
- [ ] Implement user activity tracking
- [ ] Add commenting on nodes

### Sprint 4.3: Mobile and Cross-Platform (Weeks 23-24)

#### 4.3.1 Responsive Design
- [ ] Optimize all views for tablet
- [ ] Optimize all views for mobile
- [ ] Add touch-friendly graph interactions
- [ ] Implement mobile capture flow
- [ ] Add PWA support (offline, installable)
- [ ] Test on major mobile browsers

### Sprint 4.4: Polish and Documentation (Weeks 23-24)

#### 4.4.1 Documentation
- [ ] Write user guide
- [ ] Write plugin development guide
- [ ] Write API reference documentation
- [ ] Create video tutorials
- [ ] Write deployment guide (self-hosting)
- [ ] Create contribution guidelines

#### 4.4.2 Testing and Quality
- [ ] Achieve 80%+ unit test coverage
- [ ] Write end-to-end tests (Playwright)
- [ ] Perform security audit
- [ ] Conduct performance benchmarking
- [ ] Run accessibility audit (WCAG 2.1 AA)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Quick Reference: Documentation Index

| Document | Description | Location |
|----------|-------------|----------|
| **PRD** | Full product requirements, features, tech stack | [docs/PRD.md](./PRD.md) |
| **Roadmap** | This file -- phased task tracking | [docs/ROADMAP.md](./ROADMAP.md) |
| **Architecture** | System design, data models, tech decisions | [docs/ARCHITECTURE.md](./ARCHITECTURE.md) |
| **Development** | Setup guide, build commands, testing | [docs/DEVELOPMENT.md](./DEVELOPMENT.md) |
| **Experiments** | Multi-stream dev strategy, branch conventions | [docs/EXPERIMENTS.md](./EXPERIMENTS.md) |

## Resource Requirements

### Development Team
- 1 Full-stack developer (primary)
- AI assistant (Devin) for implementation support
- Design input as needed

### Infrastructure (MVP)
- Node.js 20+ runtime
- Neo4j Community Edition (or in-memory for development)
- PostgreSQL 15+
- Redis 7+
- Optional: Ollama for local AI models

### External Services
- OpenAI API key (for cloud AI features)
- Chrome Web Store developer account (for extension publishing)

---

**Document Version**: 2.0.0
**Last Updated**: 2026-03-12
**Status**: Active
**Author**: @tmdcpro
