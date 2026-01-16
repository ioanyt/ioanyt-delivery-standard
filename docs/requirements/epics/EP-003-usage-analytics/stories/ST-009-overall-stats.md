# ST-009: Overall Statistics

**Epic:** [EP-003: Usage Analytics](../README.md)
**Story Points:** 3
**Priority:** P1
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As a** system administrator
**I want** overall usage statistics
**So that** I can monitor system-wide usage patterns

---

## Acceptance Criteria

### AC1: Stats Endpoint
- **Given** events exist in the system
- **When** I GET /v1/usage/stats
- **Then** I receive system-wide statistics

### AC2: Stats Content
- **Given** the stats response
- **When** I examine the data
- **Then** it includes: totalEvents, uniqueEntities, uniqueEventTypes, eventsPerDay

### AC3: Empty System
- **Given** no events in the system
- **When** I GET /v1/usage/stats
- **Then** I receive stats with all zeros

---

## Technical Notes

### API Endpoints
- `GET /v1/usage/stats` - Get overall statistics

### Response Format
```json
{
  "totalEvents": 15000,
  "uniqueEntities": 500,
  "uniqueEventTypes": 12,
  "eventsPerDay": 750,
  "oldestEvent": "2026-01-01T00:00:00Z",
  "newestEvent": "2026-01-15T23:59:59Z"
}
```

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] Efficient calculation (single pass)
- [x] API documentation updated

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
