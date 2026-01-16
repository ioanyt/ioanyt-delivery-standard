# ST-004: Record Usage Events

**Epic:** [EP-002: Event Tracking](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As an** application developer
**I want** to record usage events via API
**So that** I can track feature usage and user behavior

---

## Acceptance Criteria

### AC1: Record Event
- **Given** valid event data (entityId, eventType, metadata)
- **When** I POST to /v1/events
- **Then** the event is stored and I receive 201 Created with the event

### AC2: Auto-generated Fields
- **Given** I submit an event
- **When** the event is stored
- **Then** id, timestamp, and traceId are auto-generated

### AC3: Metadata Support
- **Given** I include optional metadata object
- **When** the event is stored
- **Then** the metadata is preserved as-is

### AC4: Response Format
- **Given** an event is successfully created
- **When** the response is returned
- **Then** it includes the complete event object with all fields

---

## Technical Notes

### Implementation Approach
- Use UUID for event ID generation
- Store events in service layer (Map-based storage)
- Include trace ID from request context
- Support arbitrary metadata object

### API Endpoints
- `POST /v1/events` - Create new event

### Request Body
```json
{
  "entityId": "user-123",
  "eventType": "feature_used",
  "metadata": {
    "feature": "dashboard",
    "duration": 30
  }
}
```

### Files Created/Modified
- `src/routes/events.js`
- `src/services/usageService.js`

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] Integration tests passing
- [x] API documentation updated
- [x] Validation errors return 400

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
