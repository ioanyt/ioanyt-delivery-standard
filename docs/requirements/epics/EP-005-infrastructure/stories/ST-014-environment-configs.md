# ST-014: Environment Configurations

**Epic:** [EP-005: Infrastructure as Code](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** team lead
**I want** separate staging and production configurations
**So that** environments are isolated but consistent

---

## Acceptance Criteria

### AC1: Staging Environment
- **Given** staging configuration
- **When** I apply terraform
- **Then** staging resources are created in isolation

### AC2: Production Environment
- **Given** production configuration
- **When** I apply terraform
- **Then** production resources are created separately

### AC3: Environment Parity
- **Given** staging and production modules
- **When** I compare configurations
- **Then** they use the same module with different variables

### AC4: Resource Sizing
- **Given** production configuration
- **When** I examine the settings
- **Then** resources are appropriately sized (larger than staging)

---

## Technical Notes

### Directory Structure
```
environments/
├── staging/
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
└── prod/
    ├── main.tf
    ├── variables.tf
    └── outputs.tf
```

### Environment Differences
| Setting | Staging | Production |
|---------|---------|------------|
| CPU | 256 | 512 |
| Memory | 512 | 1024 |
| Desired Count | 1 | 2 |
| Auto-scale Max | 2 | 10 |

### State Management
- Remote state in S3 with DynamoDB locking
- Separate state files per environment

---

## Definition of Done

- [x] Staging configuration complete
- [x] Production configuration complete
- [x] Both use same modules
- [x] Appropriate sizing per environment
- [x] State isolation verified

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
