# EP-004: CI/CD Pipeline

**Business Value:** Automate quality gates and deployment for reliable, repeatable releases
**Total Story Points:** 9 points
**Stories:** 3 stories
**Sprint:** Sprint 2
**Status:** Done

---

## Description

This epic implements the continuous integration and deployment pipeline using GitHub Actions. It ensures code quality through automated testing, linting, and security scanning before any code reaches production.

Key deliverables include:
- CI workflow (lint, test, security scan on every PR)
- CD workflow for staging (auto-deploy on merge to main)
- CD workflow for production (manual approval gate)

---

## Success Criteria

- [x] All PRs run automated tests and linting
- [x] Security vulnerabilities block deployment
- [x] Staging auto-deploys on merge
- [x] Production requires manual approval
- [x] Deployment status visible in GitHub

---

## Stories (3 stories, 9 points)

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| [ST-010](stories/ST-010-ci-workflow.md) | CI Workflow | 3 | P0 | Done |
| [ST-011](stories/ST-011-cd-staging.md) | CD Staging Workflow | 3 | P0 | Done |
| [ST-012](stories/ST-012-cd-production.md) | CD Production Workflow | 3 | P0 | Done |

---

## Dependencies

### Depends On
- EP-001: API Foundation (code to test/deploy)

### Required By
- EP-005: Infrastructure (deployment target)
- EP-006: Monitoring (deployment triggers alerts)

---

## Technical Scope

### Components Affected
- `.github/workflows/ci.yml` - Continuous integration
- `.github/workflows/cd-staging.yml` - Staging deployment
- `.github/workflows/cd-prod.yml` - Production deployment

### Key Technologies
- GitHub Actions
- npm audit (security scanning)
- Docker (container builds)

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
