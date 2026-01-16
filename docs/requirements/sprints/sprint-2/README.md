# Sprint 2: Infrastructure & Operations

**Duration:** Weeks 3-4
**Start Date:** 2026-01-20
**End Date:** 2026-01-31
**Total Points:** 27 points
**Status:** Done

---

## Sprint Goal

Deliver production-ready infrastructure with CI/CD pipelines, Infrastructure as Code, and comprehensive monitoring. Enable confident deployments and rapid issue diagnosis.

---

## Capacity

| Metric | Value |
|--------|-------|
| Team Size | 2 engineers |
| Sprint Duration | 2 weeks |
| Planned Velocity | 27 points |
| Committed Points | 27 points |
| Buffer | 10% |

---

## Stories by Epic

### EP-004: CI/CD Pipeline (3 stories, 9 points)

| Story | Title | Points | Status |
|-------|-------|--------|--------|
| [ST-010](../../epics/EP-004-cicd-pipeline/stories/ST-010-ci-workflow.md) | CI Workflow | 3 | Done |
| [ST-011](../../epics/EP-004-cicd-pipeline/stories/ST-011-cd-staging.md) | CD Staging Workflow | 3 | Done |
| [ST-012](../../epics/EP-004-cicd-pipeline/stories/ST-012-cd-production.md) | CD Production Workflow | 3 | Done |

### EP-005: Infrastructure as Code (3 stories, 10 points)

| Story | Title | Points | Status |
|-------|-------|--------|--------|
| [ST-013](../../epics/EP-005-infrastructure/stories/ST-013-terraform-modules.md) | Terraform Modules | 4 | Done |
| [ST-014](../../epics/EP-005-infrastructure/stories/ST-014-environment-configs.md) | Environment Configurations | 3 | Done |
| [ST-015](../../epics/EP-005-infrastructure/stories/ST-015-secrets-management.md) | Secrets Management | 3 | Done |

### EP-006: Monitoring & Observability (3 stories, 8 points)

| Story | Title | Points | Status |
|-------|-------|--------|--------|
| [ST-016](../../epics/EP-006-monitoring/stories/ST-016-cloudwatch-dashboard.md) | CloudWatch Dashboard | 3 | Done |
| [ST-017](../../epics/EP-006-monitoring/stories/ST-017-alerting.md) | Alerting Configuration | 3 | Done |
| [ST-018](../../epics/EP-006-monitoring/stories/ST-018-structured-logging.md) | Structured Logging | 2 | Done |

---

## Key Deliverables

- [x] CI pipeline with lint, test, security scan
- [x] CD pipeline for staging (auto-deploy)
- [x] CD pipeline for production (manual approval)
- [x] Terraform modules for ECS deployment
- [x] Staging and production configurations
- [x] CloudWatch dashboard
- [x] Production alerts
- [x] Structured logging

---

## Dependencies

### External Dependencies
- AWS account with appropriate permissions
- GitHub repository secrets configured
- ECR repository created

### Cross-Team Dependencies
- None

---

## Sprint Review Notes

### Completed
- All 9 stories completed
- Full CI/CD pipeline operational
- Infrastructure reproducible via Terraform
- Monitoring and alerting configured

### Learnings
- Started CI/CD early which enabled faster feedback loops
- Dashboard helped catch resource sizing issues
- Production approval gate caught one near-miss deployment

---

**Created:** 2026-01-20
**Last Updated:** 2026-01-16
