# Production-Ready Node.js API with AWS, Terraform & CI/CD

[![CI](https://github.com/ioanyt/ioanyt-delivery-standard/actions/workflows/ci.yml/badge.svg)](https://github.com/ioanyt/ioanyt-delivery-standard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Enterprise-grade software delivery reference implementation demonstrating how to build, deploy, and operate production-ready backend services.**

This repository shows what professional software delivery looks like: a complete Node.js REST API with AWS ECS Fargate infrastructure, Terraform IaC, GitHub Actions CI/CD pipelines, CloudWatch monitoring, and full operational documentation.

> **IOanyT Delivery Standard** - We don't just write code. We deliver operational systems.

## Who This Is For

- **CTOs & Engineering Leaders** evaluating software delivery partners
- **Architects** looking for production-ready Node.js + AWS reference implementations
- **Teams** establishing CI/CD, IaC, and monitoring standards
- **Startups** scaling from MVP to production-grade infrastructure

## What This Demonstrates

| Component | Implementation |
|-----------|----------------|
| **Production Node.js API** | Express.js with proper separation of concerns, error handling, structured logging |
| **Automated Testing** | Jest + Supertest with 80%+ coverage threshold |
| **CI/CD Pipeline** | GitHub Actions: lint, test, security scan, build, deploy |
| **Infrastructure as Code** | Terraform modules for AWS ECS Fargate, ALB, VPC, ECR |
| **Monitoring & Alerting** | CloudWatch dashboards, alarms, structured JSON logging |
| **Operational Docs** | Architecture decisions, runbooks, handoff guides |
| **Agile Process** | Epics, Stories, Sprints with full traceability |

## The Application

A self-tracking **Usage Metrics API** - the API records and reports its own usage, making it a self-demonstrating system.

### API Endpoints

```
POST /v1/events              → Record a usage event
GET  /v1/events              → List events (with filters)
GET  /v1/usage/:entityId     → Get usage summary for entity
GET  /v1/usage/:entityId/history → Time-series usage data
GET  /v1/usage/stats         → Overall statistics
GET  /health                 → Kubernetes liveness probe
GET  /ready                  → Kubernetes readiness probe
```

See [OpenAPI Specification](docs/openapi.yaml) for complete API documentation.

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
├── src/                        # Application source code
│   ├── routes/                 # API route handlers
│   ├── services/               # Business logic
│   ├── middleware/             # Express middleware
│   └── utils/                  # Utilities (logger, etc.)
├── tests/                      # Test suites
│   ├── unit/                   # Unit tests
│   └── integration/            # Integration tests
├── infrastructure/             # Infrastructure as Code
│   └── terraform/              # Terraform configurations
│       ├── modules/            # Reusable modules (ECS, ALB, VPC)
│       └── environments/       # Environment-specific configs
├── monitoring/                 # Observability configurations
│   ├── dashboards/             # CloudWatch dashboard JSON
│   └── alerts/                 # Alert configurations
├── docs/                       # Documentation
│   ├── requirements/           # Epics, Stories, Sprints
│   ├── openapi.yaml            # OpenAPI 3.0 specification
│   └── *.md                    # Architecture, API, Runbook, Handoff
└── .github/
    ├── workflows/              # CI/CD pipeline definitions
    └── ISSUE_TEMPLATE/         # Epic and Story templates
```

## Documentation

### Technical Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/ARCHITECTURE.md) | System design, component diagrams, technology decisions |
| [API Reference](docs/API.md) | Complete endpoint documentation with examples |
| [OpenAPI Spec](docs/openapi.yaml) | Machine-readable API specification (Swagger) |
| [Runbook](docs/RUNBOOK.md) | Operations guide, troubleshooting, incident response |
| [Handoff Guide](docs/HANDOFF.md) | Team onboarding, knowledge transfer checklist |
| [Delivery Checklist](DELIVERY_CHECKLIST.md) | Quality gates and delivery standards |

### Requirements & Agile Documentation

Full traceability from business requirements to implementation:

```
docs/requirements/
├── README.md                   # Requirements overview
├── TRACEABILITY-MATRIX.md      # Feature-to-story mapping
├── epics/                      # Epic specifications
│   ├── EP-001-api-foundation/
│   │   ├── README.md           # Epic: API Foundation (8 pts)
│   │   └── stories/
│   │       ├── ST-001-express-setup.md
│   │       ├── ST-002-health-endpoints.md
│   │       └── ST-003-request-tracking.md
│   ├── EP-002-event-tracking/  # Epic: Event Tracking (10 pts)
│   ├── EP-003-usage-analytics/ # Epic: Usage Analytics (10 pts)
│   ├── EP-004-cicd-pipeline/   # Epic: CI/CD Pipeline (9 pts)
│   ├── EP-005-infrastructure/  # Epic: Infrastructure as Code (10 pts)
│   └── EP-006-monitoring/      # Epic: Monitoring & Observability (8 pts)
└── sprints/
    ├── sprint-1/               # Sprint 1: Core API (28 pts)
    └── sprint-2/               # Sprint 2: DevOps & Infra (27 pts)
```

### GitHub Project Management

- [Project Board](https://github.com/orgs/ioanyt/projects/1) - Sprint board with Story Points, Issue Types, Sprint assignments
- [GitHub Issues](https://github.com/ioanyt/ioanyt-delivery-standard/issues) - 6 Epics + 18 Stories with labels and linking

| Sprint | Focus | Stories | Points |
|--------|-------|---------|--------|
| Sprint 1 | Core API Development | 9 | 28 |
| Sprint 2 | CI/CD, Infrastructure, Monitoring | 9 | 27 |

> **Note:** This is a reference implementation. All issues are marked "Done" to demonstrate a completed delivery.

## Architecture

```
                              ┌─────────────────────────────────────────┐
                              │              AWS Cloud                   │
                              │                                          │
┌──────────┐     HTTPS       │  ┌───────┐      ┌─────────────────┐     │
│  Client  │ ───────────────▶│  │  ALB  │─────▶│   ECS Fargate   │     │
└──────────┘                 │  └───────┘      │  ┌───────────┐  │     │
                              │                 │  │  Task 1   │  │     │
                              │                 │  │  Task 2   │  │     │
                              │                 │  └───────────┘  │     │
                              │                 └────────┬────────┘     │
                              │                          │              │
                              │                          ▼              │
                              │                 ┌─────────────────┐     │
                              │                 │   CloudWatch    │     │
                              │                 └─────────────────┘     │
                              └─────────────────────────────────────────┘
```

See [Architecture Documentation](docs/ARCHITECTURE.md) for detailed component diagrams and design decisions.

## Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 LTS |
| Framework | Express.js |
| Testing | Jest, Supertest |
| CI/CD | GitHub Actions |
| Infrastructure | Terraform, AWS ECS Fargate |
| Container | Docker, Amazon ECR |
| Load Balancing | AWS Application Load Balancer |
| Monitoring | Amazon CloudWatch |
| Logging | Structured JSON (Winston) |

## Our Delivery Standard

Every IOanyT engagement includes:

- Production-ready code with comprehensive tests
- CI/CD pipeline (lint, test, security scan, build, deploy)
- Infrastructure as code (100% reproducible environments)
- Monitoring dashboards and alerting
- Complete documentation (architecture, API, runbook)
- Handoff and knowledge transfer

See [DELIVERY_CHECKLIST.md](DELIVERY_CHECKLIST.md) for our complete quality checklist.

## License

MIT License - See [LICENSE](LICENSE) for details.

> **Note:** This repository is a reference implementation for demonstration purposes. When you engage IOanyT for a project, your deliverables are your intellectual property with full ownership transferred upon completion.

---

**IOanyT** - Premium Software Services for Growth-Stage Companies

[ioanyt.com](https://ioanyt.com) | [Contact Us](mailto:hello@ioanyt.com)
