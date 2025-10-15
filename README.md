# Knowledge Graph Studio (A subgraph of "Yggdrasil; The World Tree Project")  🧠🕸️

> A highly customizable, interactive knowledge graph management platform that eliminates boundaries between users and developers

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D20.0.0-green)](https://nodejs.org)
[![DevContainer Ready](https://img.shields.io/badge/DevContainer-Ready-blue)](https://containers.dev)
[![Documentation](https://img.shields.io/badge/docs-available-brightgreen)](./docs)

## 🌟 Overview

Knowledge Graph Studio is a revolutionary platform for managing, visualizing, and extracting knowledge from the web. It combines powerful graph database technology with intuitive visual interfaces and advanced AI capabilities to create the ultimate personal knowledge management system.

### ✨ Key Features

- **🎨 Interactive Graph Visualization** - Pan, zoom, and manipulate your knowledge graph in 2D/3D
- **🌐 Advanced Web Extraction** - Extract content from any website with visual selection or automated workflows
- **🤖 AI-Powered Intelligence** - Automatic tagging, semantic search, and natural language queries
- **🔧 Complete Customizability** - Every component is accessible, modifiable, and extendable
- **👁️ Full Observability** - Peek under the hood at any time to see what's happening
- **🔌 Plugin Ecosystem** - Extend functionality with custom plugins and integrations
- **📱 Cross-Platform** - Web, desktop (Electron), and mobile applications

## 🚀 Quick Start

### Using DevContainers (Recommended)

1. **Prerequisites**
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Install [VS Code](https://code.visualstudio.com/) with [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Clone and Open**
   ```bash
   jj git clone https://github.com/yourusername/knowledge-graph-studio.git
   cd knowledge-graph-studio
   code .
   ```

3. **Start Development**
   - VS Code will prompt to "Reopen in Container" - click yes
   - Wait for the container to build (first time ~10-15 minutes)
   - All services will start automatically

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Neo4j Browser: http://localhost:7474
   - GraphQL Playground: http://localhost:5000/graphql

### Local Setup (Without Docker)

See [Development Guide](./docs/DEVELOPMENT.md) for detailed local setup instructions.

## 📖 Documentation

- **[Product Requirements](./docs/PRD.md)** - Detailed feature specifications
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - Technical architecture and design decisions
- **[Development Setup](./docs/DEVELOPMENT.md)** - Complete development environment setup
- **[Roadmap](./docs/ROADMAP.md)** - Project timeline and task breakdown
- **[API Documentation](./docs/API.md)** - REST and GraphQL API reference
- **[Plugin Development](./docs/PLUGINS.md)** - Guide to creating custom plugins

## 🏗️ Project Structure

```
knowledge-graph-studio/
├── .devcontainer/          # DevContainer configuration
├── frontend/               # React/Vue frontend application
├── backend/                # NestJS/FastAPI backend
├── services/              
│   ├── extraction/        # Web extraction service
│   ├── semantic/          # AI/ML semantic service
│   └── workflow/          # Workflow automation engine
├── packages/              # Shared packages
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Shared utilities
│   └── ui/               # Shared UI components
├── plugins/               # Plugin directory
├── docs/                  # Documentation
├── tests/                 # E2E and integration tests
└── scripts/              # Build and deployment scripts
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **State Management**: Redux Toolkit / Zustand
- **Graph Visualization**: Cytoscape.js / D3.js
- **UI Library**: Ant Design / Material-UI
- **Styling**: Tailwind CSS

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS
- **API**: GraphQL (Apollo) + REST
- **ORM**: Prisma / TypeORM

### Databases
- **Graph Database**: Neo4j 5.x
- **Relational**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Search**: Elasticsearch 8.x
- **Vector Store**: ChromaDB

### Infrastructure
- **Containerization**: Docker + Docker Compose
- **Version Control**: Jujutsu (jj) + Git
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## 🧑‍💻 Development

### Working with Jujutsu (jj)

```bash
# Create a new change
jj new -m "feat: add new feature"

# View status
jj status

# View diff
jj diff

# Create a branch
jj branch create feature/my-feature

# Push changes
jj git push
```

### Common Commands

```bash
# Start development servers
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format

# Build for production
pnpm build

# Run E2E tests
pnpm test:e2e
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Process

1. Fork the repository
2. Create a feature branch (`jj branch create feature/amazing-feature`)
3. Commit your changes (`jj describe -m "feat: add amazing feature"`)
4. Push to your fork (`jj git push`)
5. Open a Pull Request

### Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## 📊 Project Status

- **Current Phase**: MVP Development (Phase 1)
- **Version**: 0.1.0-alpha
- **Sprint**: 1.1 - Foundation
- **Target Release**: Q1 2025

See our [Roadmap](./docs/ROADMAP.md) for detailed progress and upcoming features.

## 🔒 Security

- All data encrypted at rest (AES-256)
- TLS 1.3 for all communications
- Plugin sandboxing for security
- Regular security audits

Report security vulnerabilities to security@knowledgegraph.studio

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Neo4j for the powerful graph database
- The open-source community for amazing tools and libraries
- Our contributors and early adopters

## 📞 Support

- **Documentation**: [docs.knowledgegraph.studio](https://docs.knowledgegraph.studio)
- **Discord Community**: [Join our server](https://discord.gg/knowledge-graph)
- **GitHub Issues**: [Report bugs](https://github.com/yourusername/knowledge-graph-studio/issues)
- **Email**: support@knowledgegraph.studio

## 🚧 Disclaimer

This project is in active development. Features and APIs may change.

---

Built with ❤️ by the Knowledge Graph Studio Team


*Making knowledge management accessible to everyone*
