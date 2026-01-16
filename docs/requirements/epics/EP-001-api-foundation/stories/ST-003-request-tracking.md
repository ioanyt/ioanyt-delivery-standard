# ST-003: Request Tracking Middleware

**Epic:** [EP-001: API Foundation](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As a** operations engineer
**I want** every request to have a unique trace ID
**So that** I can correlate logs and debug issues across the request lifecycle

---

## Acceptance Criteria

### AC1: Trace ID Generation
- **Given** a request without x-trace-id header
- **When** the request is processed
- **Then** a UUID trace ID is generated and attached

### AC2: Trace ID Passthrough
- **Given** a request with x-trace-id header
- **When** the request is processed
- **Then** the provided trace ID is used (not overwritten)

### AC3: Response Header
- **Given** any request is processed
- **When** the response is sent
- **Then** the x-trace-id header is included in the response

### AC4: Log Correlation
- **Given** a request is being processed
- **When** any log statement is executed
- **Then** the trace ID is included in the log entry

---

## Technical Notes

### Implementation Approach
- Create middleware that runs early in the chain
- Use UUID v4 for trace ID generation
- Store trace ID in request object for downstream access
- Configure Winston logger to include trace ID

### Files Created/Modified
- `src/middleware/requestTracker.js` - Trace ID middleware
- `src/utils/logger.js` - Logger with trace ID support

### Dependencies
- uuid: ^9.0.1

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] Trace ID present in all responses
- [x] Logs include trace ID
- [x] Self-tracking events include trace ID

---

## Testing Notes

### Unit Tests
- [x] Middleware generates UUID when header missing
- [x] Middleware uses provided header when present
- [x] Trace ID attached to request object

### Integration Tests
- [x] Response includes x-trace-id header
- [x] Same trace ID in request and response

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
