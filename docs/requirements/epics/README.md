# Epics Index

**Project:** Usage Metrics API
**Stage:** Stage 1
**Total Epics:** 6
**Total Stories:** 18
**Total Points:** 55

---

## Epic Summary

| Epic | Name | Stories | Points | Sprint | Status |
|------|------|---------|--------|--------|--------|
| [EP-001](EP-001-api-foundation/README.md) | API Foundation | 3 | 8 | 1 | Done |
| [EP-002](EP-002-event-tracking/README.md) | Event Tracking | 3 | 10 | 1 | Done |
| [EP-003](EP-003-usage-analytics/README.md) | Usage Analytics | 3 | 10 | 1 | Done |
| [EP-004](EP-004-cicd-pipeline/README.md) | CI/CD Pipeline | 3 | 9 | 2 | Done |
| [EP-005](EP-005-infrastructure/README.md) | Infrastructure as Code | 3 | 10 | 2 | Done |
| [EP-006](EP-006-monitoring/README.md) | Monitoring & Observability | 3 | 8 | 2 | Done |

---

## By Sprint

### Sprint 1 (28 points)
- [EP-001: API Foundation](EP-001-api-foundation/README.md) - 8 points
- [EP-002: Event Tracking](EP-002-event-tracking/README.md) - 10 points
- [EP-003: Usage Analytics](EP-003-usage-analytics/README.md) - 10 points

### Sprint 2 (27 points)
- [EP-004: CI/CD Pipeline](EP-004-cicd-pipeline/README.md) - 9 points
- [EP-005: Infrastructure as Code](EP-005-infrastructure/README.md) - 10 points
- [EP-006: Monitoring & Observability](EP-006-monitoring/README.md) - 8 points

---

## Epic Dependency Graph

```
EP-001 (API Foundation)
    │
    ├──> EP-002 (Event Tracking)
    │        │
    │        └──> EP-003 (Usage Analytics)
    │
    └──> EP-004 (CI/CD Pipeline)
             │
             ├──> EP-005 (Infrastructure)
             │
             └──> EP-006 (Monitoring)
```

---

## Status Legend

| Status | Meaning |
|--------|---------|
| Not Started | Epic not yet started |
| In Progress | At least one story in progress |
| Done | All stories completed |

---

**Last Updated:** 2026-01-16
