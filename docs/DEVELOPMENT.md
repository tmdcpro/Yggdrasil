# Development Setup Guide

## Prerequisites

### Required Software
- **Docker Desktop** (Windows/Mac) or Docker Engine (Linux) v20.10+
- **VS Code** with Dev Containers extension
- **Jujutsu (jj)** version control system
- **Node.js** 20+ (for local development without containers)
- **Python** 3.11+ (for local development without containers)

### Recommended Tools
- **PowerShell Core** 7+ (Windows)
- **WSL2** (Windows users)
- **GitHub CLI** (`gh`) for repository management
- **Postman** or **Insomnia** for API testing

## Quick Start with DevContainers

### 1. Clone the Repository
```bash
# Using jj (recommended)
jj git clone https://github.com/yourusername/knowledge-graph-studio.git
cd knowledge-graph-studio

# Or using git
git clone https://github.com/yourusername/knowledge-graph-studio.git
cd knowledge-graph-studio
jj git init --colocate  # Initialize jj alongside git
```

### 2. Open in VS Code with DevContainers
```bash
# Open VS Code
code .

# When prompted, select "Reopen in Container"
# Or use Command Palette: "Dev Containers: Reopen in Container"
```

### 3. Wait for Container Build
The first build will take 10-15 minutes to:
- Build the Docker image
- Install all dependencies
- Set up databases
- Configure the development environment

### 4. Verify Installation
```bash
# Inside the container terminal
jj status               # Check repository status
npm --version          # Should show 10.x
python --version       # Should show 3.11.x
neo4j --version        # Neo4j should be running
psql --version         # PostgreSQL client ready
```

## Local Development Setup (Without Containers)

### Windows Setup

#### 1. Install Dependencies
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install development tools
choco install nodejs-lts python jujutsu docker-desktop vscode -y

# Install pnpm
npm install -g pnpm
```

#### 2. Set up Python Environment
```powershell
# Create virtual environment
python -m venv .venv

# Activate virtual environment
.\.venv\Scripts\Activate.ps1

# Install Python dependencies
pip install -r requirements.txt
```

#### 3. Install Node Dependencies
```powershell
# Install dependencies
pnpm install

# Install global tools
pnpm add -g @nestjs/cli vite playwright
```

### macOS Setup

#### 1. Install Dependencies
```bash
# Install Homebrew (if not installed)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install development tools
brew install node@20 python@3.11 jujutsu docker

# Install pnpm
npm install -g pnpm
```

#### 2. Set up Environment
```bash
# Create Python virtual environment
python3.11 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pnpm install
```

### Linux Setup

#### 1. Install Dependencies
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm python3.11 python3.11-venv docker.io docker-compose

# Install jujutsu
cargo install --locked jj-cli

# Install pnpm
npm install -g pnpm
```

#### 2. Set up Environment
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Set up Python environment
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Install Node dependencies
pnpm install
```

## Database Setup

### Neo4j Setup
```bash
# Using Docker
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/knowledge123 \
  -e NEO4J_PLUGINS='["apoc", "graph-data-science"]' \
  -v neo4j_data:/data \
  neo4j:5-community

# Access Neo4j Browser at http://localhost:7474
# Username: neo4j, Password: knowledge123
```

### PostgreSQL Setup
```bash
# Using Docker
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_USER=kguser \
  -e POSTGRES_PASSWORD=kgpass \
  -e POSTGRES_DB=knowledgegraph \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:15-alpine

# Connect using psql
psql -h localhost -U kguser -d knowledgegraph
```

### Redis Setup
```bash
# Using Docker
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v redis_data:/data \
  redis:7-alpine redis-server --appendonly yes

# Test connection
redis-cli ping
```

## Environment Configuration

### 1. Create Environment File
```bash
cp .env.example .env
```

### 2. Configure Environment Variables
```env
# Application
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://kguser:kgpass@localhost:5432/knowledgegraph
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=knowledge123
REDIS_URL=redis://localhost:6379

# External Services
OPENAI_API_KEY=your_api_key_here
BROWSERLESS_URL=http://localhost:3333

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_encryption_key_here
```

## Working with Jujutsu (jj)

### Basic Workflow
```bash
# Check status
jj status

# Create a new change
jj new -m "feat: add new feature"

# Make your changes
# ...

# View diff
jj diff

# Update the description
jj describe -m "feat: implement graph visualization"

# Create a branch
jj branch create feature/graph-viz

# Push to remote
jj git push
```

### Common Commands
```bash
jj log                  # View commit history
jj show                 # Show current change
jj split                # Split changes into multiple commits
jj squash               # Combine changes
jj rebase -d main       # Rebase onto main
jj abandon              # Abandon current change
```

## Running the Application

### Development Mode

#### Frontend
```bash
# Terminal 1
cd frontend
pnpm dev
# Access at http://localhost:3000
```

#### Backend
```bash
# Terminal 2
cd backend
pnpm dev
# API at http://localhost:5000
# GraphQL Playground at http://localhost:5000/graphql
```

#### All Services (using Concurrently)
```bash
# From project root
pnpm dev:all
```

### Production Build

#### Build Frontend
```bash
cd frontend
pnpm build
# Output in frontend/dist
```

#### Build Backend
```bash
cd backend
pnpm build
# Output in backend/dist
```

#### Build Docker Images
```bash
# Build all services
docker-compose build

# Run production stack
docker-compose -f docker-compose.prod.yml up
```

## Testing

### Unit Tests
```bash
# Frontend tests
cd frontend
pnpm test
pnpm test:coverage

# Backend tests
cd backend
pnpm test
pnpm test:coverage
```

### Integration Tests
```bash
# API integration tests
cd backend
pnpm test:integration

# Database integration tests
pnpm test:db
```

### E2E Tests
```bash
# Install Playwright browsers (first time)
npx playwright install

# Run E2E tests
pnpm test:e2e

# Run in headed mode for debugging
pnpm test:e2e:headed
```

### Performance Tests
```bash
# Using k6
k6 run tests/performance/load-test.js

# Using Artillery
artillery run tests/performance/stress-test.yml
```

## Code Quality

### Linting
```bash
# Frontend
cd frontend
pnpm lint
pnpm lint:fix

# Backend
cd backend
pnpm lint
pnpm lint:fix
```

### Formatting
```bash
# Format all code
pnpm format

# Check formatting
pnpm format:check
```

### Type Checking
```bash
# TypeScript type checking
pnpm typecheck
```

## Debugging

### VS Code Debugging

#### Frontend Debugging
1. Install Chrome/Edge DevTools extension
2. Use launch configuration: "Debug Frontend"
3. Set breakpoints in VS Code
4. Press F5 to start debugging

#### Backend Debugging
1. Use launch configuration: "Debug Backend"
2. Set breakpoints in TypeScript files
3. Press F5 to start debugging

### Chrome DevTools
```javascript
// For React DevTools
window.__REACT_DEVTOOLS_GLOBAL_HOOK__

// For Redux DevTools
window.__REDUX_DEVTOOLS_EXTENSION__
```

### Database Debugging

#### Neo4j Queries
```cypher
// Profile query performance
PROFILE MATCH (n:Node)-[r:RELATES_TO]->(m:Node)
WHERE n.type = 'document'
RETURN n, r, m

// Explain query plan
EXPLAIN MATCH (n:Node) RETURN n
```

#### PostgreSQL Queries
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM metadata WHERE created_at > NOW() - INTERVAL '1 day';

-- View active connections
SELECT * FROM pg_stat_activity;
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
# Windows
netstat -ano | findstr :3000

# Mac/Linux
lsof -i :3000

# Kill process
# Windows
taskkill /PID <PID> /F

# Mac/Linux
kill -9 <PID>
```

#### Docker Issues
```bash
# Reset Docker environment
docker system prune -a
docker volume prune

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### Node Module Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json pnpm-lock.yaml
pnpm cache clean --force
pnpm install
```

#### Database Connection Issues
```bash
# Test PostgreSQL connection
pg_isready -h localhost -p 5432

# Test Neo4j connection
curl http://localhost:7474

# Test Redis connection
redis-cli ping
```

## IDE Setup

### VS Code Extensions

#### Required Extensions
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Language support
- **Dev Containers**: Container development
- **Jujutsu**: jj version control integration

#### Recommended Extensions
- **GitHub Copilot**: AI code completion
- **Thunder Client**: API testing
- **Database Client**: Database management
- **Docker**: Container management
- **Todo Tree**: TODO management

### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[python]": {
    "editor.defaultFormatter": "ms-python.black-formatter"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "files.exclude": {
    "**/node_modules": true,
    "**/.next": true,
    "**/dist": true
  }
}
```

## Contributing Guidelines

### Code Style
- Follow the existing code style
- Use TypeScript for type safety
- Write meaningful commit messages
- Add tests for new features
- Update documentation

### Pull Request Process
1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Update documentation
5. Run linting and tests
6. Submit pull request
7. Address review feedback

### Commit Message Format
```
type(scope): subject

body

footer
```

Types: feat, fix, docs, style, refactor, test, chore

Example:
```
feat(graph): add node clustering algorithm

Implemented k-means clustering for graph nodes
based on similarity scores.

Closes #123
```

## Resources

### Documentation
- [Project README](../README.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [API Documentation](./API.md)
- [Plugin Development](./PLUGINS.md)

### External Resources
- [Jujutsu Documentation](https://github.com/martinvonz/jj)
- [Neo4j Documentation](https://neo4j.com/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Community
- Discord: [Join our server](https://discord.gg/knowledge-graph)
- GitHub Discussions: [Ask questions](https://github.com/yourusername/knowledge-graph-studio/discussions)
- Issue Tracker: [Report bugs](https://github.com/yourusername/knowledge-graph-studio/issues)

---

**Last Updated**: 2025-10-12  
**Version**: 1.0.0