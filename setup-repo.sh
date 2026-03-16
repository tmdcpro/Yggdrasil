#!/bin/bash

# Yggdrasil - Interactive Knowledge Graph Platform
# Repository Setup and Push Script

set -e

echo "🌳 Yggdrasil - Repository Setup Script"
echo "======================================="

# Repository configuration
REPO_URL="https://github.com/tmdcpro/Yggdrasil.git"
BRANCH_NAME="main"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're already in a git repository
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  Already in a git repository. Continuing...${NC}"
else
    echo -e "${BLUE}📦 Initializing git repository...${NC}"
    git init
fi

# Set up git configuration if not already set
if ! git config user.name > /dev/null 2>&1; then
    echo -e "${YELLOW}⚙️  Git user not configured. Please enter your details:${NC}"
    read -p "Enter your name: " git_name
    read -p "Enter your email: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
fi

# Add remote origin if not exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo -e "${BLUE}🔗 Adding remote origin...${NC}"
    git remote add origin $REPO_URL
else
    echo -e "${YELLOW}⚠️  Remote origin already exists. Updating...${NC}"
    git remote set-url origin $REPO_URL
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo -e "${BLUE}📝 Creating .gitignore...${NC}"
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
__pycache__/
*.py[cod]
*$py.class
venv/
env/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Environment variables
.env
.env.local
.env.production

# Logs
logs/
*.log
npm-debug.log*

# Build outputs
dist/
build/
coverage/

# Docker
.dockerignore

# Database
*.db
*.sqlite

# Uploads
uploads/
temp/

# Secrets
secrets/
*.key
*.pem
EOF
fi

# Create LICENSE file
if [ ! -f "LICENSE" ]; then
    echo -e "${BLUE}📄 Creating MIT LICENSE...${NC}"
    cat > LICENSE << 'EOF'
MIT License

Copyright (c) 2025 Yggdrasil - Interactive Knowledge Graph Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
EOF
fi

# Create directory structure
echo -e "${BLUE}📁 Creating directory structure...${NC}"
mkdir -p backend/app/{api/v1/endpoints,core,models,services,utils}
mkdir -p backend/{tests,requirements}
mkdir -p frontend/src/{components,pages,hooks,services,store,types,utils}
mkdir -p frontend/public
mkdir -p scraping-service/src/{scrapers,extractors,queue,utils}
mkdir -p scraping-service/tests
mkdir -p ai-service/src/{processors,models,embeddings,ontology}
mkdir -p ai-service/tests
mkdir -p infrastructure/{k8s,helm,monitoring,backup}
mkdir -p docs/{architecture,api,deployment,development,user-guides,diagrams}
mkdir -p scripts
mkdir -p logs
mkdir -p checkpoints
mkdir -p .github/workflows

# Stage all files
echo -e "${BLUE}📦 Staging files for commit...${NC}"
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo -e "${YELLOW}⚠️  No changes to commit.${NC}"
else
    # Commit changes
    echo -e "${BLUE}💾 Committing initial project structure...${NC}"
    git commit -m "🌱 Initial commit: Yggdrasil Knowledge Graph Platform

- Complete project structure and documentation
- Backend: FastAPI + Neo4j foundation
- Frontend: React + TypeScript + D3.js
- Microservices: Scraping and AI processing
- Infrastructure: Docker, Kubernetes, CI/CD
- Observability: Logging, monitoring, checkpoints
- Development environment setup scripts

Version: 0.1.0-alpha
Checkpoint: project_foundation"
fi

# Push to remote repository
echo -e "${BLUE}🚀 Pushing to remote repository...${NC}"
git push -u origin $BRANCH_NAME

echo -e "${GREEN}✅ Repository setup complete!${NC}"
echo ""
echo -e "${BLUE}📊 Repository Information:${NC}"
echo -e "Repository: ${YELLOW}$REPO_URL${NC}"
echo -e "Branch: ${YELLOW}$BRANCH_NAME${NC}"
echo ""
echo -e "${BLUE}🔗 Next Steps:${NC}"
echo "1. Visit your repository: https://github.com/tmdcpro/Yggdrasil"
echo "2. Set up GitHub secrets for CI/CD (KUBE_CONFIG_DATA, API keys)"
echo "3. Enable GitHub Actions in repository settings"
echo "4. Configure branch protection rules"
echo "5. Set up development environment: ./scripts/setup-dev.sh"
echo ""
echo -e "${GREEN}🌳 Welcome to Yggdrasil - Where knowledge grows into wisdom!${NC}"