
#!/bin/bash

# Yggdrasil - Complete File Organization Script
# This script organizes all project files into the proper directory structure

set -e

echo "🌳 Organizing Yggdrasil project files..."

# Create all necessary directories
echo "📁 Creating directory structure..."

# Root directories
mkdir -p backend/app/{api/v1/endpoints,core,models,services,utils}
mkdir -p backend/{tests,requirements}
mkdir -p frontend/src/{components,pages,hooks,services,store,types,utils}
mkdir -p frontend/public
mkdir -p scraping-service/src/{scrapers,extractors,queue,utils}
mkdir -p scraping-service/tests
mkdir -p ai-service/src/{processors,models,embeddings,ontology}
mkdir -p ai-service/tests
mkdir -p infrastructure/{k8s/{staging,production},helm,monitoring,backup}
mkdir -p docs/{architecture,api,deployment,development,user-guides,diagrams}
mkdir -p scripts
mkdir -p logs
mkdir -p checkpoints
mkdir -p .github/workflows

echo "✅ Directory structure created!"

# List all files that need to be created/organized
echo ""
echo "📋 Files to organize:"
echo ""
echo "Root files:"
echo "  - README.md (comprehensive project documentation)"
echo "  - LICENSE (MIT license)"
echo "  - .gitignore (comprehensive ignore patterns)"
echo "  - docker-compose.dev.yml (development environment)"
echo "  - docker-compose.test.yml (testing environment)"
echo "  - docker-compose.prod.yml (production environment)"
echo ""
echo "Backend files:"
echo "  - backend/app/main.py (FastAPI application)"
echo "  - backend/app/core/config.py (configuration management)"
echo "  - backend/app/core/database.py (Neo4j connection)"
echo "  - backend/app/models/node.py (data models)"
echo "  - backend/app/services/node_service.py (business logic)"
echo "  - backend/app/api/v1/api.py (API router)"
echo "  - backend/app/api/v1/endpoints/nodes.py (node endpoints)"
echo "  - backend/requirements/base.txt (Python dependencies)"
echo "  - backend/Dockerfile (production container)"
echo "  - backend/Dockerfile.dev (development container)"
echo ""
echo "Frontend files:"
echo "  - frontend/package.json (Node.js dependencies and scripts)"
echo "  - frontend/src/main.tsx (React application entry)"
echo "  - frontend/src/App.tsx (main app component)"
echo "  - frontend/src/components/Layout.tsx (layout component)"
echo "  - frontend/src/components/GraphVisualization.tsx (D3.js visualization)"
echo "  - frontend/src/pages/GraphPage.tsx (graph page)"
echo "  - frontend/vite.config.ts (Vite configuration)"
echo "  - frontend/tailwind.config.js (TailwindCSS configuration)"
echo "  - frontend/Dockerfile (production container)"
echo "  - frontend/Dockerfile.dev (development container)"
echo ""
echo "Scraping Service files:"
echo "  - scraping-service/package.json (Node.js dependencies)"
echo "  - scraping-service/src/server.js (Express server)"
echo "  - scraping-service/src/scrapers/base.js (base scraper class)"
echo "  - scraping-service/Dockerfile (container configuration)"
echo ""
echo "AI Service files:"
echo "  - ai-service/requirements.txt (Python dependencies)"
echo "  - ai-service/src/main.py (FastAPI application)"
echo "  - ai-service/src/processors/text_processor.py (text processing)"
echo "  - ai-service/Dockerfile (container configuration)"
echo ""
echo "Infrastructure files:"
echo "  - infrastructure/k8s/staging/ (Kubernetes staging manifests)"
echo "  - infrastructure/k8s/production/ (Kubernetes production manifests)"
echo "  - infrastructure/helm/ (Helm charts)"
echo "  - infrastructure/monitoring/ (Grafana/Prometheus configs)"
echo ""
echo "Scripts:"
echo "  - scripts/setup-dev.sh (development environment setup)"
echo "  - scripts/run-tests.sh (test runner)"
echo "  - scripts/backup.sh (backup script)"
echo "  - scripts/deploy.sh (deployment script)"
echo ""
echo "CI/CD:"
echo "  - .github/workflows/ci-cd.yml (GitHub Actions workflow)"
echo ""
echo "Documentation:"
echo "  - docs/architecture/ (architecture documentation)"
echo "  - docs/api/ (API documentation)"
echo "  - docs/deployment/ (deployment guides)"
echo "  - docs/diagrams/ (system diagrams)"
echo ""

echo "🚀 Ready to organize files!"
echo ""
echo "Next steps:"
echo "1. Copy all generated files to their respective directories"
echo "2. Run: chmod +x scripts/*.sh"
echo "3. Run: ./setup-repo.sh to push to GitHub"
echo "4. Set up GitHub secrets for CI/CD"
echo "5. Enable GitHub Actions"

