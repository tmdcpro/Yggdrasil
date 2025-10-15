#!/bin/bash
set -e

echo "🚀 Initializing Knowledge Graph Studio development environment..."

# Initialize jj repository if not already initialized
if [ ! -d ".jj" ]; then
    echo "📦 Initializing jujutsu repository..."
    jj git init
    jj branch create main
fi

# Install Node dependencies if package.json exists
if [ -f "package.json" ]; then
    echo "📦 Installing Node.js dependencies..."
    pnpm install
fi

# Install Python dependencies if requirements.txt or pyproject.toml exists
if [ -f "requirements.txt" ]; then
    echo "🐍 Installing Python dependencies from requirements.txt..."
    pip install -r requirements.txt
elif [ -f "pyproject.toml" ]; then
    echo "🐍 Installing Python dependencies with Poetry..."
    poetry install
fi

# Set up pre-commit hooks if .pre-commit-config.yaml exists
if [ -f ".pre-commit-config.yaml" ]; then
    echo "🔧 Setting up pre-commit hooks..."
    pre-commit install
fi

# Create necessary directories
mkdir -p data/extracted
mkdir -p data/graphs
mkdir -p logs
mkdir -p tmp

# Set proper permissions
chmod +x scripts/*.sh 2>/dev/null || true
chmod +x scripts/*.py 2>/dev/null || true

echo "✅ Post-create setup complete!"
echo ""
echo "📝 Quick start commands:"
echo "  - jj status     : Check repository status"
echo "  - jj log        : View commit history"
echo "  - jj new        : Create a new change"
echo "  - jj describe   : Describe current change"
echo ""
echo "🌐 Service URLs:"
echo "  - Frontend:     http://localhost:3000"
echo "  - Backend API:  http://localhost:5000"
echo "  - Neo4j Browser: http://localhost:7474"
echo "  - PostgreSQL:   localhost:5432"
echo "  - Redis:        localhost:6379"
echo ""