# Yggdrasil - Interactive Knowledge Graph Platform
*The World Tree of Knowledge*

[![CI/CD Pipeline](https://github.com/tmdcpro/Yggdrasil/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/tmdcpro/Yggdrasil/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-0.1.0--alpha-blue.svg)](https://github.com/tmdcpro/Yggdrasil/releases)

A highly customizable, modular platform for building AI-assisted knowledge graphs from web research, with complete observability and seamless user/developer experience.

## 🌟 Features

- **Interactive Knowledge Graph Visualization** - D3.js powered graph exploration
- **AI-Assisted Semantic Tagging** - Automated ontology building with LLMs
- **Advanced Web Scraping** - CUA frameworks with anti-detection measures
- **Complete Observability** - Every operation visible and customizable
- **Modular Architecture** - Extensible microservices design
- **No User/Developer Boundaries** - GUI and code-level access unified

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/tmdcpro/Yggdrasil.git
   cd Yggdrasil
   ```

2. **Run the setup script:**
   ```bash
   chmod +x scripts/setup-dev.sh
   ./scripts/setup-dev.sh
   ```

3. **Access the platform:**
   - 🌐 **Frontend**: [http://localhost:3000](http://localhost:3000)
   - 📊 **Neo4j Browser**: [http://localhost:7474](http://localhost:7474) (neo4j/password)
   - 📚 **API Documentation**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - 🔧 **Backend API**: [http://localhost:8000](http://localhost:8000)

### Alternative Quick Start (Docker only)
```bash
docker-compose -f docker-compose.dev.yml up --build
```

## 🏛️ Architecture

![System Architecture](docs/diagrams/system-architecture.png)

### System Components
- **Backend API** (FastAPI + Neo4j) - Core graph operations and business logic
- **Frontend** (React + TypeScript + D3.js) - Interactive user interface
- **Scraping Service** (Node.js + Playwright) - Web data extraction
- **AI Service** (Python + LangChain) - Semantic processing and tagging
- **Observability Stack** - Monitoring, logging, and analytics

### File Structure
```
Yggdrasil/
├── backend/                 # FastAPI backend service
│   ├── app/
│   │   ├── api/v1/         # API routes and endpoints
│   │   ├── core/           # Configuration and database
│   │   ├── models/         # Data models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── tests/              # Backend tests
│   ├── requirements/       # Python dependencies
│   └── Dockerfile
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API clients
│   │   ├── store/          # State management
│   │   └── types/          # TypeScript definitions
│   ├── public/             # Static assets
│   └── package.json
├── scraping-service/       # Web scraping microservice
│   ├── src/
│   │   ├── scrapers/       # Site-specific scrapers
│   │   ├── extractors/     # Content extractors
│   │   ├── queue/          # Job queue management
│   │   └── utils/          # Utilities
│   └── tests/
├── ai-service/             # AI processing microservice
│   ├── src/
│   │   ├── processors/     # Content processors
│   │   ├── models/         # AI model integrations
│   │   ├── embeddings/     # Vector embeddings
│   │   └── ontology/       # Ontology builders
│   └── tests/
├── infrastructure/         # Deployment configurations
│   ├── k8s/               # Kubernetes manifests
│   ├── helm/              # Helm charts
│   ├── monitoring/        # Grafana/Prometheus configs
│   └── backup/            # Backup configurations
├── docs/                  # Documentation
│   ├── architecture/      # Architecture documentation
│   ├── api/              # API documentation
│   ├── deployment/       # Deployment guides
│   └── user-guides/      # User documentation
├── scripts/               # Automation scripts
│   ├── setup-dev.sh      # Development environment setup
│   ├── run-tests.sh      # Test runner
│   ├── backup.sh         # Backup script
│   └── deploy.sh         # Deployment script
├── logs/                  # Application logs
├── checkpoints/           # Development checkpoints
└── README.md
```

## 🛠️ Development

### Running Tests
```bash
# All tests
./scripts/run-tests.sh

# Backend only
docker-compose -f docker-compose.dev.yml exec backend pytest tests/ -v

# Frontend only
docker-compose -f docker-compose.dev.yml exec frontend npm test
```

### Development Commands
```bash
# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop all services
docker-compose -f docker-compose.dev.yml down

# Restart services
docker-compose -f docker-compose.dev.yml restart

# Access service shell
docker-compose -f docker-compose.dev.yml exec backend bash
```

## 🚢 Deployment

### Kubernetes Deployment

1. **Prerequisites:**
   - Kubernetes cluster (Talos Linux + Rancher recommended)
   - kubectl configured
   - Helm 3.x installed

2. **Deploy with Helm:**
   ```bash
   helm install yggdrasil infrastructure/helm/yggdrasil \
     --namespace yggdrasil \
     --create-namespace
   ```

3. **Or deploy with kubectl:**
   ```bash
   kubectl apply -f infrastructure/k8s/
   ```

### Recommended Infrastructure Setup
- **Cluster OS**: Talos Linux (secure, immutable)
- **Management**: Rancher (multi-cluster, RBAC, UI)
- **Monitoring**: Prometheus + Grafana
- **Storage**: Persistent volumes for Neo4j and uploads
- **Ingress**: NGINX or Traefik for external access

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# Database Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
NEO4J_DATABASE=neo4j

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# AI Services (Optional)
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key

# Development Settings
DEBUG=true
LOG_LEVEL=DEBUG
```

## 📊 Monitoring & Observability

### Built-in Observability
- **Health Checks**: `/health` endpoints for all services
- **Metrics**: Prometheus metrics exposed on `/metrics`
- **Logging**: Structured logging with correlation IDs
- **Tracing**: Distributed tracing for request flows

### Dashboards
- **Application Metrics**: Grafana dashboard for performance monitoring
- **Infrastructure**: Resource usage and cluster health
- **Business Metrics**: Knowledge graph growth and user activity

## 🔄 Backup & Recovery

### Automated Backups
```bash
# Create backup
./scripts/backup.sh

# Restore from backup
./scripts/restore.sh backup_name
```

### Backup Components
- Neo4j database dumps
- Uploaded files and assets
- Redis data snapshots
- Configuration files
- Docker volumes

## 🧪 Testing Strategy

- **Unit Tests**: 80%+ coverage for all services
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright browser automation
- **Performance Tests**: Load testing for graph operations
- **Security Tests**: Vulnerability scanning

## 🚦 CI/CD Pipeline

GitHub Actions workflow includes:
- **Build**: Docker image creation for all services
- **Test**: Automated test suite execution
- **Security**: Vulnerability scanning
- **Deploy**: Kubernetes deployment to staging/production
- **Monitor**: Post-deployment health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the established code style
- Add tests for new features
- Update documentation
- Ensure all CI checks pass

## 📖 Documentation

- **Architecture**: [docs/architecture/](docs/architecture/)
- **API Reference**: [docs/api/](docs/api/)
- **Deployment Guide**: [docs/deployment/](docs/deployment/)
- **User Guides**: [docs/user-guides/](docs/user-guides/)

## 📈 Roadmap

### Phase 1: Foundation (Months 1-3) ✅
- [x] Backend API with Neo4j integration
- [x] Frontend with graph visualization
- [x] Development environment setup
- [x] Basic CRUD operations

### Phase 2: Data Collection (Months 4-6)
- [ ] Web scraping integration
- [ ] File upload and processing
- [ ] Bulk import/export
- [ ] Content extraction pipelines

### Phase 3: AI Enhancement (Months 7-9)
- [ ] LLM integration for tagging
- [ ] Automated ontology generation
- [ ] Semantic search
- [ ] Knowledge graph reasoning

### Phase 4: Advanced Features (Months 10-12)
- [ ] Real-time collaboration
- [ ] Plugin architecture
- [ ] Mobile interface
- [ ] Advanced analytics

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Neo4j](https://neo4j.com/) for the graph database
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
- [D3.js](https://d3js.org/) for graph visualization
- [Playwright](https://playwright.dev/) for web scraping

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/tmdcpro/Yggdrasil/issues)
- **Discussions**: [GitHub Discussions](https://github.com/tmdcpro/Yggdrasil/discussions)
- **Documentation**: [Project Wiki](https://github.com/tmdcpro/Yggdrasil/wiki)

---

**Yggdrasil** - *Where knowledge grows into wisdom* 🌳