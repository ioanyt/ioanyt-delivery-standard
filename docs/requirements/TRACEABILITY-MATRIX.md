# Traceability Matrix

**Project:** Usage Metrics API
**Last Updated:** 2026-01-16

---

## Purpose

This matrix traces features to their implementing stories, ensuring complete coverage and enabling impact analysis for changes.

---

## Feature to Story Mapping

### API Features

| Feature ID | Feature Name | Stories | Status |
|------------|--------------|---------|--------|
| FEAT-001 | Health Check Endpoints | ST-002 | Done |
| FEAT-002 | Request Tracing | ST-003, ST-018 | Done |
| FEAT-003 | Event Recording | ST-004, ST-006 | Done |
| FEAT-004 | Event Querying | ST-005 | Done |
| FEAT-005 | Usage Summary | ST-007 | Done |
| FEAT-006 | Usage History | ST-008 | Done |
| FEAT-007 | Overall Statistics | ST-009 | Done |

### Infrastructure Features

| Feature ID | Feature Name | Stories | Status |
|------------|--------------|---------|--------|
| FEAT-008 | CI Pipeline | ST-010 | Done |
| FEAT-009 | CD Staging | ST-011 | Done |
| FEAT-010 | CD Production | ST-012 | Done |
| FEAT-011 | ECS Infrastructure | ST-013, ST-014 | Done |
| FEAT-012 | Secrets Management | ST-015 | Done |

### Observability Features

| Feature ID | Feature Name | Stories | Status |
|------------|--------------|---------|--------|
| FEAT-013 | Monitoring Dashboard | ST-016 | Done |
| FEAT-014 | Alerting | ST-017 | Done |
| FEAT-015 | Structured Logging | ST-018 | Done |

---

## Story to Component Mapping

| Story | Components Affected |
|-------|---------------------|
| ST-001 | src/app.js, src/config.js, src/index.js |
| ST-002 | src/routes/health.js |
| ST-003 | src/middleware/requestTracker.js |
| ST-004 | src/routes/events.js, src/services/usageService.js |
| ST-005 | src/routes/events.js, src/services/usageService.js |
| ST-006 | src/routes/events.js |
| ST-007 | src/routes/usage.js, src/services/usageService.js |
| ST-008 | src/routes/usage.js, src/services/usageService.js |
| ST-009 | src/routes/usage.js, src/services/usageService.js |
| ST-010 | .github/workflows/ci.yml |
| ST-011 | .github/workflows/cd-staging.yml, Dockerfile |
| ST-012 | .github/workflows/cd-prod.yml |
| ST-013 | infrastructure/terraform/modules/ |
| ST-014 | infrastructure/terraform/environments/ |
| ST-015 | infrastructure/terraform/environments/ |
| ST-016 | monitoring/dashboards/ |
| ST-017 | monitoring/alerts/ |
| ST-018 | src/utils/logger.js |

---

## Epic to Deliverable Mapping

| Epic | Deliverables |
|------|--------------|
| EP-001 | Express app, health endpoints, request tracking |
| EP-002 | Event recording API, event querying API |
| EP-003 | Usage summary, usage history, overall stats |
| EP-004 | CI workflow, CD staging, CD production |
| EP-005 | Terraform modules, environment configs |
| EP-006 | CloudWatch dashboard, alerts, logging |

---

## Test Coverage Mapping

| Story | Unit Tests | Integration Tests |
|-------|------------|-------------------|
| ST-001 | tests/unit/config.test.js | tests/integration/app.test.js |
| ST-002 | - | tests/integration/api.test.js |
| ST-003 | tests/unit/requestTracker.test.js | tests/integration/api.test.js |
| ST-004 | tests/unit/usageService.test.js | tests/integration/api.test.js |
| ST-005 | tests/unit/usageService.test.js | tests/integration/api.test.js |
| ST-006 | tests/unit/validation.test.js | tests/integration/api.test.js |
| ST-007 | tests/unit/usageService.test.js | tests/integration/api.test.js |
| ST-008 | tests/unit/usageService.test.js | tests/integration/api.test.js |
| ST-009 | tests/unit/usageService.test.js | tests/integration/api.test.js |

---

## Change Impact Analysis

When modifying a component, use this matrix to identify:
1. Which stories originally implemented the component
2. Which tests cover the component
3. Which features depend on the component

---

**Last Updated:** 2026-01-16
