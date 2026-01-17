# IOanyT Delivery Standard

**A reference implementation demonstrating IOanyT's production-ready delivery practices.**

This repository showcases what you receive when you partner with IOanyT: not just code, but a complete operational system ready for production.

## What This Demonstrates

| Component | Description |
|-----------|-------------|
| **Clean Code** | Well-structured Node.js/Express API with proper separation of concerns |
| **Comprehensive Testing** | Unit and integration tests with 80%+ coverage threshold |
| **CI/CD Pipeline** | Automated testing, security scanning, and deployment workflows |
| **Infrastructure as Code** | Complete Terraform configuration for AWS (ECS Fargate) |
| **Monitoring & Alerting** | CloudWatch dashboards and production-ready alerts |
| **Documentation** | Architecture, API, runbook, and handoff guides |

## The Application

A self-tracking **Usage Metrics API** - the API records and reports its own usage, making it a self-demonstrating system.

### Endpoints

```
POST /v1/events          → Record a usage event
GET  /v1/events          → List events (with filters)
GET  /v1/usage/:entityId → Get usage summary
GET  /v1/usage/:entityId/history → Time-series data
GET  /v1/usage/stats     → Overall statistics
GET  /health             → Liveness probe
GET  /ready              → Readiness probe
```

## Quick Start

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## Project Structure

```
├── src/                    # Application source code
│   ├── routes/             # API route handlers
│   ├── services/           # Business logic
│   ├── middleware/         # Express middleware
│   └── utils/              # Utilities (logger, etc.)
├── tests/                  # Test suites
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── infrastructure/         # Infrastructure as Code
│   └── terraform/          # Terraform configurations
│       ├── modules/        # Reusable modules
│       └── environments/   # Environment-specific configs
├── monitoring/             # Observability configs
│   ├── dashboards/         # CloudWatch dashboard JSON
│   └── alerts/             # Alert configurations
├── docs/                   # Documentation
│   ├── ARCHITECTURE.md     # System design
│   ├── API.md              # API documentation
│   ├── RUNBOOK.md          # Operations guide
│   └── HANDOFF.md          # Onboarding guide
├── .github/workflows/      # CI/CD pipelines
└── DELIVERY_CHECKLIST.md   # Our delivery standard
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md) - System design and decisions
- [API Documentation](docs/API.md) - Complete API reference
- [OpenAPI Specification](docs/openapi.yaml) - Machine-readable API spec
- [Runbook](docs/RUNBOOK.md) - Operations and troubleshooting
- [Handoff Guide](docs/HANDOFF.md) - Team onboarding

## Project Management

This project demonstrates proper agile delivery with full traceability:

- [Requirements Documentation](docs/requirements/) - Epics, Stories, and Sprint planning
- [GitHub Project Board](https://github.com/orgs/ioanyt/projects/1) - Sprint tracking with Story Points
- [GitHub Issues](https://github.com/ioanyt/ioanyt-delivery-standard/issues) - 6 Epics + 18 Stories

> **Note:** This is a reference implementation. All issues are marked as "Done" to demonstrate a completed delivery.

## Our Delivery Standard

Every IOanyT engagement includes:

✅ Production-ready code with tests
✅ CI/CD pipeline (lint, test, security scan, deploy)
✅ Infrastructure as code (100% reproducible)
✅ Monitoring dashboards and alerts
✅ Comprehensive documentation
✅ Handoff and knowledge transfer

See [DELIVERY_CHECKLIST.md](DELIVERY_CHECKLIST.md) for our complete quality checklist.

## Technology Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **CI/CD**: GitHub Actions
- **Infrastructure**: Terraform + AWS (ECS Fargate)
- **Monitoring**: CloudWatch

## License

MIT License - See [LICENSE](LICENSE) for details.

---

**IOanyT** - Premium Software Services for Growth-Stage Companies

[ioanyt.com](https://ioanyt.com) | [Contact Us](mailto:hello@ioanyt.com)
