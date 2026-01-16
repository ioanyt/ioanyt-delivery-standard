# ST-008: Usage History Time-Series

**Epic:** [EP-003: Usage Analytics](../README.md)
**Story Points:** 4
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As an** analyst
**I want** time-series usage data
**So that** I can visualize trends and patterns over time

---

## Acceptance Criteria

### AC1: History Endpoint
- **Given** an entity with events over multiple days
- **When** I GET /v1/usage/{entityId}/history
- **Then** I receive time-bucketed event counts

### AC2: Granularity Options
- **Given** I specify granularity=hourly
- **When** I request history
- **Then** data is grouped by hour

### AC3: Date Range Filter
- **Given** I specify startDate and endDate
- **When** I request history
- **Then** only events in that range are included

### AC4: Zero-fill Buckets
- **Given** a time period with no events
- **When** I request history
- **Then** that bucket shows count: 0 (no gaps)

---

## Technical Notes

### API Endpoints
- `GET /v1/usage/:entityId/history` - Get time-series data

### Query Parameters
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| granularity | string | daily | daily, hourly |
| startDate | ISO8601 | 7 days ago | Start of range |
| endDate | ISO8601 | now | End of range |

### Response Format
```json
{
  "entityId": "user-123",
  "granularity": "daily",
  "data": [
    { "period": "2026-01-14", "count": 25 },
    { "period": "2026-01-15", "count": 42 }
  ]
}
```

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] Both granularities work correctly
- [x] Empty buckets filled with zeros
- [x] API documentation updated

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
