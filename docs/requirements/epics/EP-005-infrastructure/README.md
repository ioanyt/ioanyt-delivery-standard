# EP-005: Infrastructure as Code

**Business Value:** Reproducible, auditable infrastructure that eliminates manual configuration
**Total Story Points:** 10 points
**Stories:** 3 stories
**Sprint:** Sprint 2
**Status:** Done

---

## Description

This epic implements 100% Infrastructure as Code using Terraform. All AWS resources are defined declaratively, ensuring environments are reproducible, changes are auditable, and no tribal knowledge is required for infrastructure management.

Key deliverables include:
- Terraform modules for ECS Fargate services
- Environment-specific configurations (staging, production)
- Secrets management via AWS Secrets Manager/SSM

---

## Success Criteria

- [x] Zero manual AWS console changes required
- [x] Staging and production environments consistent
- [x] Terraform state managed remotely
- [x] Secrets not stored in code
- [x] Auto-scaling configured

---

## Stories (3 stories, 10 points)

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| [ST-013](stories/ST-013-terraform-modules.md) | Terraform Modules | 4 | P0 | Done |
| [ST-014](stories/ST-014-environment-configs.md) | Environment Configurations | 3 | P0 | Done |
| [ST-015](stories/ST-015-secrets-management.md) | Secrets Management | 3 | P0 | Done |

---

## Dependencies

### Depends On
- EP-004: CI/CD Pipeline (deployment workflows)

### Required By
- EP-006: Monitoring (infrastructure to monitor)

---

## Technical Scope

### Components Affected
- `infrastructure/terraform/modules/` - Reusable modules
- `infrastructure/terraform/environments/` - Environment configs

### Key Technologies
- Terraform 1.x
- AWS ECS Fargate
- AWS ALB
- AWS ECR
- AWS Secrets Manager

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
