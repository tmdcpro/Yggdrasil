# Product Requirements Document: Yggdrasil

## Executive Summary

Yggdrasil is a personal knowledge graph and data collection/management system ("second brain") that captures, organizes, and visualizes information with AI-powered semantic understanding. It combines right-click content capture from any source with an intelligent knowledge graph that auto-tags, classifies, and connects information using ontologies, taxonomies, and semantic relationships.

The name "Yggdrasil" references the Norse world tree connecting all realms of knowledge -- reflecting the system's goal of interconnecting all captured information into a navigable, living knowledge structure.

## Vision Statement

To create the ultimate personal knowledge management system where every piece of captured information is automatically enriched with semantic meaning, interconnected through intelligent relationships, and navigable through highly customizable views -- empowering users to build their personal knowledge universes with complete control.

## Core Principles

1. **Capture Everything**: Right-click to save anything -- text, images, links, files, URLs, code, screenshots, videos -- from any context
2. **AI-First Organization**: Automatic metadata extraction, entity recognition, semantic tagging, and relationship inference
3. **Graph-Native**: All information stored as nodes in a knowledge graph with typed, weighted relationships
4. **Customizable Views**: Multiple visualization modes (graph, timeline, kanban, table, hierarchy, dashboard) with user-defined custom views
5. **No User/Developer Distinction**: Every user has full access to source code and system internals
6. **Complete Observability**: "Peek under the hood" at any time to understand system behavior
7. **Modular Architecture**: Every component is replaceable and extendable
8. **Multi-Stream Development**: Experimental features developed in parallel branches for comparison and contrast

## Research and Inspiration

### Open Source Projects Evaluated

| Project | Stars | Key Insight for Yggdrasil |
|---------|-------|--------------------------|
| **[Semantica](https://github.com/Hawksight-AI/semantica)** | 711 | AI/semantic backend: entity extraction, ontology engineering, KG building. Strongest candidate for semantic service core. |
| **[Karakeep](https://github.com/karakeep-app/karakeep)** | 24k | Best reference for AI auto-tagging UX, browser extensions, content capture, Ollama local model support. |
| **[Cytoscape.js](https://js.cytoscape.org)** | -- | Gold standard for graph visualization in the browser (100k+ nodes). |
| **[Knowledge Nexus](https://github.com/Jallermax/knowledge-nexus)** | -- | GraphRAG on Neo4j, shows how to connect stack for Q&A. |
| **[Kappa Graph](https://github.com/aaronsb/knowledge-graph-system)** | -- | Novel "knowledge with weight" concept (grounding scores, disagreement tracking). |
| **[Unigraph](https://github.com/unigraph-dev/unigraph-dev)** | 751 | Universal PKG connecting Gmail/Calendar/feeds. "Everything is a node" philosophy. |

### Key Differentiators from Existing Tools

- **vs Obsidian**: True graph database (not just file links), AI auto-tagging, right-click capture from anywhere
- **vs Roam Research**: Semantic relationships beyond bi-directional links, ontology/taxonomy support, customizable views
- **vs Notion**: Graph-native storage, advanced extraction pipeline, full code access
- **vs Karakeep**: Deeper semantic understanding (ontologies, hierarchies), custom graph views, multi-stream dev
## User Personas

### 1. Knowledge Worker / Researcher
- **Needs**: Organize vast amounts of research materials, track sources, build knowledge connections
- **Goals**: Create comprehensive knowledge graphs for research projects
- **Pain Points**: Information scattered across multiple platforms, difficulty tracking relationships
- **Key Feature**: AI auto-tagging with domain-specific ontologies

### 2. Content Creator / Curator
- **Needs**: Collect inspiration, organize references, track content ideas
- **Goals**: Build visual mood boards and reference libraries
- **Pain Points**: Losing track of inspiration sources, manual organization effort
- **Key Feature**: Right-click capture from any webpage with metadata extraction

### 3. Developer / Power User
- **Needs**: Customize extraction workflows, build automation, extend functionality
- **Goals**: Create custom plugins and views for specific use cases
- **Pain Points**: Rigid tools that don't adapt to specific workflows
- **Key Feature**: Full source access, plugin system, multi-stream experiments

### 4. Lifelong Learner
- **Needs**: Organize bookmarks, notes, videos, articles into a coherent knowledge structure
- **Goals**: Build a "second brain" that grows smarter over time
- **Pain Points**: Information overload, lack of semantic organization
- **Key Feature**: Semantic relationship inference, knowledge graph visualization

## Feature Requirements

### 1. Content Capture System (Priority: P0)

#### 1.1 Chrome Extension -- Right-Click Capture
- **Right-click context menu** on any selected text, image, link, or page
- **Capture types**: Page URL, selected text, images, links, files, code snippets, screenshots, video URLs
- **AI metadata extraction**: Auto-grabs URL, description, source, author, date, favicon, OpenGraph data
- **User review step**: Choose/select which metadata to include, edit AI suggestions, specify types
- **Quick capture**: One-click save with AI defaults (no review step)
- **Sidebar panel**: Optional sidebar for richer capture without leaving the page

#### 1.2 Manual Capture (Web UI)
- Content type selector (Page URL, Text/Note, Code Snippet, Link, Image URL, Video URL, Screenshot)
- Title field with auto-generation
- Content/URL input
- AI extraction toggle
- Tag management (manual + AI-suggested tags)
- Save with preview

#### 1.3 Extraction Pipeline
- **URL metadata extraction**: Title, description, author, date, favicon, OpenGraph, Twitter Card
- **Content extraction**: Main text, images, structured data (JSON-LD, microdata)
- **Screenshot capture**: Full page and viewport screenshots
- **Video extraction**: Thumbnails, metadata, transcripts (YouTube, Vimeo)
- **SSRF protection**: Block localhost, private networks, IPv6 loopback, redirect validation

### 2. AI-Powered Semantic Engine (Priority: P0)

#### 2.1 Auto-Tagging
- Entity recognition (people, places, organizations, concepts)
- Topic classification with confidence scores
- Keyword extraction from content
- Language detection
- Sentiment analysis

#### 2.2 Semantic Relationships
- **Ontology mappings**: Map captured content to domain ontologies (e.g., Dublin Core, Schema.org)
- **Taxonomy hierarchies**: Auto-classify into user-defined or standard taxonomies
- **Relationship inference**: Suggest connections between nodes based on semantic similarity
- **Domain detection**: Identify which knowledge domain(s) content belongs to
- **Weighted edges**: Confidence-scored relationships between nodes

#### 2.3 AI Providers
- **Cloud**: OpenAI, Anthropic, Cohere (via API keys)
- **Local**: Ollama with local models (Llama, Mistral, etc.)
- **Embeddings**: Sentence Transformers or OpenAI Ada for semantic similarity
- **Fallback chain**: Cloud -> Local -> Rule-based heuristics

### 3. Knowledge Graph Engine (Priority: P0)

#### 3.1 Data Model
- **Node Types**: URL/Bookmark, Text/Document, Image/Video, Person/Entity, Concept/Tag, Collection/Folder, Ontology, Taxonomy
- **Edge Types**: References, Contains/Part-of, Similar-to, Derived-from, Temporal, Belongs-to, Custom
- **Properties**: Typed, validated, versioned node/edge properties
- **Metadata**: Creation date, source, confidence scores, extraction provenance

#### 3.2 Graph Operations
- CRUD for nodes and edges
- Graph traversal (BFS/DFS)
- Shortest path, connected components
- Clustering and community detection
- Semantic similarity search via embeddings
- Full-text search across all node content

#### 3.3 Storage
- **Primary**: Neo4j for graph storage (in-memory fallback for development)
- **Metadata**: PostgreSQL for structured metadata, user settings
- **Cache**: Redis for query caching, session management
- **Vectors**: ChromaDB for embedding storage and similarity search
- **Media**: S3/MinIO for images, screenshots, files
### 4. Visualization and Custom Views (Priority: P1)

#### 4.1 Graph View
- 2D interactive graph (Cytoscape.js) with pan, zoom, selection
- 3D graph view (Three.js / React Three Fiber) for immersive exploration
- Force-directed, hierarchical, circular, and custom layouts
- Node filtering by type, tag, date, domain
- Edge filtering by relationship type and weight
- Mini-map for navigation
- Focus mode for subgraph exploration

#### 4.2 Additional View Types
- **Timeline**: Chronological view of captures
- **Kanban**: Board view organized by tags, domains, or status
- **Table**: Spreadsheet-like view with sorting, filtering, grouping
- **Hierarchy**: Tree view based on taxonomy/ontology relationships
- **Dashboard**: Customizable widgets showing stats, recent captures, tag clouds
- **Map**: Geographic view for location-tagged content

#### 4.3 Custom Views System
- User-defined view configurations (filters, layouts, groupings)
- Saved views with shareable URLs
- View templates for common patterns
- Plugin-based custom view renderers

### 5. User Interface (Priority: P1)

#### 5.1 Application Shell
- Sidebar navigation (Dashboard, Capture, Graph, + custom views)
- Dark theme by default with theme system (light/custom)
- Responsive design (desktop-first, tablet/mobile support)
- Command palette (Cmd+K) for quick actions
- Keyboard shortcuts throughout

#### 5.2 Property Inspector
- Node detail panel with all properties
- Relationship editor
- Metadata viewer with extraction provenance
- Edit history / versioning

#### 5.3 Search and Filter
- Universal search across all content
- Advanced filters (type, tag, date range, domain, source)
- Saved searches
- Natural language queries ("show me all videos about machine learning from last month")

### 6. Extensibility (Priority: P2)

#### 6.1 Plugin System
- Plugin API with documented extension points
- Hot reload during development
- Plugin marketplace (future)
- Sandboxed execution

#### 6.2 Platform-Specific Extractors (Plugins)
- YouTube: Videos, playlists, channels, transcripts
- Twitter/X: Threads, profiles, media
- GitHub: Repositories, issues, code snippets
- Academic: Papers, citations, authors (Semantic Scholar, arXiv)
- Reddit: Posts, comments, subreddits
- Generic: Custom CSS/XPath extraction rules

#### 6.3 Integration APIs
- REST API (current: NestJS with Swagger docs)
- GraphQL API (planned)
- WebSocket for real-time updates
- Webhooks for event notifications
- Import/export (JSON, CSV, Markdown, OPML)

### 7. Observability and Developer Experience (Priority: P2)

#### 7.1 System Transparency
- "Peek under the hood" at any time
- View extraction pipeline steps and intermediate results
- See AI confidence scores and reasoning
- Performance metrics dashboard

#### 7.2 Audit Trail
- Change history for all nodes/edges
- Data lineage and source tracking
- Version control for graph state

#### 7.3 Multi-Stream Development
- Git branch-based experiments for feature variations
- Git worktrees for parallel development
- Experiment documentation and comparison
- See EXPERIMENTS.md for conventions

## Non-Functional Requirements

### Performance
- Handle graphs with 100k+ nodes in visualization
- Sub-second query response for common operations
- 60 FPS graph visualization
- Capture-to-graph latency < 3 seconds
- Concurrent extraction of 100+ URLs

### Security
- SSRF protection on all URL extraction (localhost, private networks, IPv6, redirects)
- XSS prevention in Chrome extension and frontend
- Input validation with NestJS ValidationPipe (whitelist, transform, forbidNonWhitelisted)
- No credential exposure in logs or client responses
- Content Security Policy headers
- End-to-end encryption option (future)
- Plugin sandboxing

### Scalability
- Horizontal scaling for extraction workers
- Distributed graph storage
- CDN support for media assets
- Multi-user collaboration support (future)

### Reliability
- Graceful degradation when AI services unavailable (fallback to rule-based)
- In-memory graph store when Neo4j unavailable
- Offline Chrome extension support (queue captures for later sync)
- Error handling with user-visible feedback (no silent failures)
- Automatic backups and data recovery

### Usability
- Onboarding in < 5 minutes
- Intuitive drag-and-drop interface
- Contextual help system
- Progressive disclosure of advanced features

### Data Portability
- Full export of knowledge graph (nodes, edges, metadata)
- Standard formats (JSON-LD, RDF, CSV)
- Import from bookmarks, Obsidian, Notion, Roam

## Technology Stack (Current Implementation)

### Frontend
- **Framework**: React 18 + TypeScript
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Build**: Vite
- **Graph Viz**: Cytoscape.js (planned), placeholder ready

### Backend
- **Framework**: NestJS (Node.js)
- **API**: REST with Swagger/OpenAPI docs
- **Validation**: class-validator + class-transformer
- **Storage**: In-memory (Neo4j integration planned)

### Services
- **Extraction Service**: Express.js, node-fetch with SSRF protection, cheerio for HTML parsing
- **Semantic Service**: Express.js, mock AI (real LLM integration planned)

### Browser Extension
- **Platform**: Chrome (Manifest V3)
- **Features**: Right-click context menu, popup UI, content script for selection capture

### Infrastructure
- **Monorepo**: pnpm workspaces
- **Linting**: ESLint (frontend + backend)
- **Type Checking**: TypeScript strict mode
- **Package Manager**: pnpm 8+
- **Node**: 20+

## Success Metrics

| Metric | Target | How Measured |
|--------|--------|-------------|
| Capture latency | < 3s from click to graph | Timer in extraction pipeline |
| AI tagging accuracy | > 80% relevant tags | User feedback on suggested tags |
| Graph query time | < 100ms for common queries | Backend metrics |
| Visualization FPS | 60 FPS with 1000 nodes | Browser performance monitor |
| Extension adoption | Works on top 100 websites | Manual testing matrix |

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| LLM API costs at scale | High | Medium | Ollama local fallback, caching, rate limiting |
| Performance with large graphs | High | High | Virtualization, lazy loading, Sigma.js fallback |
| Complex UI overwhelming users | Medium | High | Progressive disclosure, sensible defaults |
| Website extraction blocking | Medium | Medium | Multiple extraction methods, Playwright fallback |
| Neo4j licensing costs | Low | Medium | ArangoDB or in-memory alternatives |
| Plugin security issues | Low | High | Sandboxing, code review, permissions system |

## Appendices

### A. Technical Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md)

### B. Development Setup
See [DEVELOPMENT.md](./DEVELOPMENT.md)

### C. Multi-Stream Strategy
See [EXPERIMENTS.md](./EXPERIMENTS.md)

### D. Project Roadmap and Task Queue
See [ROADMAP.md](./ROADMAP.md)

---

**Document Version**: 2.0.0
**Last Updated**: 2026-03-12
**Status**: Active
**Author**: @tmdcpro
