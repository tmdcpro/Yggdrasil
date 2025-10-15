# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Essential Commands

### Development Servers
```bash
# Start all services (frontend, backend, extraction service)
pnpm dev

# Start individual services
pnpm dev:frontend    # React app at http://localhost:3000
pnpm dev:backend     # NestJS API at http://localhost:5000
pnpm dev:extraction  # Web extraction service

# Production build
pnpm build          # Build all
pnpm build:frontend # Build frontend only
pnpm build:backend  # Build backend only
```

### Testing
```bash
# Run all tests
pnpm test

# Specific test types
pnpm test:frontend   # Frontend unit tests
pnpm test:backend    # Backend unit tests
pnpm test:e2e        # End-to-end tests with Playwright

# Type checking
pnpm typecheck
pnpm typecheck:frontend
pnpm typecheck:backend
```

### Code Quality
```bash
# Linting
pnpm lint            # Lint all
pnpm lint:frontend   # Frontend only
pnpm lint:backend    # Backend only

# Formatting
pnpm format          # Format all files
pnpm format:check    # Check formatting without changes
```

### Database Operations
```bash
# Database migrations
pnpm db:migrate      # Run migrations
pnpm db:seed         # Seed database
pnpm db:reset        # Reset database

# Docker database containers
docker-compose up -d neo4j postgres redis    # Start databases
docker-compose logs -f neo4j                 # View Neo4j logs
docker-compose down                          # Stop all containers
```

### Version Control (Jujutsu)
```bash
# Jujutsu workflow
jj status           # Check status
jj new -m "feat: description"  # Create new change
jj diff             # View changes
jj describe -m "updated message"  # Update commit message
jj branch create feature/name     # Create branch
jj git push         # Push to GitHub
jj git fetch && jj rebase -d main  # Sync with main
```

## Architecture Overview

### Service Architecture
The system uses a modular microservices architecture with clear separation of concerns:

```
Frontend (React/TypeScript) → API Gateway → Service Layer → Data Layer
```

#### Core Services
1. **Graph Engine Service** (`/backend`): Core graph operations, Neo4j queries, graph algorithms
2. **Extraction Service** (`/services/extraction`): Web scraping, content extraction, browser automation
3. **Semantic Service** (`/services/semantic`): AI/ML operations, embeddings, auto-tagging
4. **Plugin Manager**: Plugin lifecycle, sandboxing, hook management

#### Data Layer Components
- **Neo4j** (port 7474/7687): Primary graph database for nodes/edges
- **PostgreSQL** (port 5432): Metadata, user data, configuration
- **Redis** (port 6379): Caching, session management, job queues
- **ChromaDB**: Vector embeddings for semantic search
- **Browserless** (port 3333): Headless browser for web extraction

### Key Interfaces

#### Graph Operations
```typescript
// Graph nodes follow this pattern
interface BaseNode {
  id: string
  type: 'url' | 'document' | 'media'
  created: Date
  metadata: Record<string, any>
}

// Edges represent relationships
type EdgeType = 'references' | 'contains' | 'similar_to' | 'derived_from'
```

#### Service Communication
- GraphQL API at `/graphql` for complex queries
- REST endpoints for CRUD operations
- WebSocket connections for real-time updates
- Event bus for inter-service communication

## Development Environment

### DevContainer Setup (Recommended)
The project includes a complete DevContainer configuration that:
- Automatically starts all required services (Neo4j, PostgreSQL, Redis, Browserless)
- Installs all dependencies (Node 20, Python 3.11, pnpm)
- Configures VS Code with required extensions
- Sets up jujutsu (jj) version control

To use: Open in VS Code → "Reopen in Container" → Wait for build (~10-15 min first time)

### Local Setup Requirements
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration:
# - NEO4J_URI=bolt://localhost:7687
# - DATABASE_URL=postgresql://kguser:kgpass@localhost:5432/knowledgegraph
# - REDIS_URL=redis://localhost:6379
# - OPENAI_API_KEY=your_key (for AI features)
```

### Windows-Specific Notes
- Use PowerShell Core 7+ or WSL2 for best experience
- Docker Desktop required for containers
- Paths in commands may need adjustment for Windows format

## Project-Specific Patterns

### Workspace Structure
This is a pnpm monorepo with workspaces:
- `/frontend`: React application
- `/backend`: NestJS API server
- `/services/*`: Microservices (extraction, semantic, workflow)
- `/packages/*`: Shared packages (types, utils, UI components)
- `/plugins/*`: Plugin extensions

### Graph Data Model
- **Nodes**: URLs, documents, media files with rich metadata
- **Edges**: Typed relationships (references, contains, similar_to)
- **Cypher queries**: Used for complex graph traversals
- **Embeddings**: Stored in ChromaDB for semantic search

### API Patterns
- GraphQL for complex queries and subscriptions
- REST for simple CRUD operations
- Socket.io for real-time updates
- BullMQ for background job processing

### Security Considerations
- JWT authentication with refresh tokens
- Node-level permissions in Neo4j
- Plugin sandboxing for security
- Encryption at rest (AES-256) and in transit (TLS 1.3)

## Critical Configuration Files

- `.env`: Environment variables (copy from .env.example)
- `.devcontainer/devcontainer.json`: VS Code container configuration
- `.devcontainer/docker-compose.yml`: Service orchestration
- `package.json`: Root workspace configuration and scripts
- `.vscode/settings.json`: Project-specific VS Code settings

## Common Development Tasks

### Adding a New Feature
1. Create a jj change: `jj new -m "feat: feature name"`
2. Implement in appropriate workspace
3. Add tests in same directory as code
4. Run `pnpm lint` and `pnpm typecheck`
5. Create branch and push: `jj branch create feature/name && jj git push`

### Debugging
- Frontend: Use Chrome DevTools or VS Code debugger with "Debug Frontend" launch config
- Backend: VS Code debugger with "Debug Backend" launch config
- Neo4j: Use Neo4j Browser at http://localhost:7474 (neo4j/knowledge123)
- API: GraphQL Playground at http://localhost:5000/graphql

### Performance Profiling
- Neo4j: Use `PROFILE` and `EXPLAIN` prefixes on Cypher queries
- Node.js: Use `--inspect` flag and Chrome DevTools
- React: React DevTools Profiler tab