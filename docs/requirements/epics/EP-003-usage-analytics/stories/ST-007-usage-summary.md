# ST-007: Usage Summary per Entity

**Epic:** [EP-003: Usage Analytics](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As a** product manager
**I want** to see a usage summary for any entity
**So that** I can understand engagement at a glance

---

## Acceptance Criteria

### AC1: Summary Endpoint
- **Given** an entity with recorded events
- **When** I GET /v1/usage/{entityId}
- **Then** I receive aggregated usage summary

### AC2: Summary Content
- **Given** the summary response
- **When** I examine the data
- **Then** it includes: totalEvents, uniqueEventTypes, firstSeen, lastSeen

### AC3: No Events Case
- **Given** an entity with no events
- **When** I GET /v1/usage/{entityId}
- **Then** I receive summary with totalEvents: 0

### AC4: Event Type Breakdown
- **Given** an entity with multiple event types
- **When** I examine the summary
- **Then** it includes count per event type

---

## Technical Notes

### API Endpoints
- `GET /v1/usage/:entityId` - Get usage summary

### Response Format
```json
{
  "entityId": "user-123",
  "totalEvents": 150,
  "uniqueEventTypes": 5,
  "firstSeen": "2026-01-01T00:00:00Z",
  "lastSeen": "2026-01-15T12:30:00Z",
  "eventTypes": {
    "page_view": 100,
    "button_click": 30,
    "feature_used": 20
  }
}
```

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] Performance acceptable for 10K+ events
- [x] API documentation updated

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
