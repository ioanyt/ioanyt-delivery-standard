# ST-018: Structured Logging

**Epic:** [EP-006: Monitoring & Observability](../README.md)
**Story Points:** 2
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** developer debugging an issue
**I want** structured JSON logs with trace IDs
**So that** I can search and correlate logs efficiently

---

## Acceptance Criteria

### AC1: JSON Format
- **Given** a log statement is executed
- **When** the log is written
- **Then** it is in valid JSON format

### AC2: Required Fields
- **Given** any log entry
- **When** I examine the structure
- **Then** it includes: timestamp, level, message, traceId, service

### AC3: Trace ID Correlation
- **Given** a request with trace ID
- **When** I search logs by that trace ID
- **Then** I find all logs for that request

### AC4: Log Levels
- **Given** different log levels are used
- **When** I filter by level
- **Then** I can isolate errors from info logs

---

## Technical Notes

### Log Structure
```json
{
  "timestamp": "2026-01-15T12:30:00.000Z",
  "level": "info",
  "message": "Request processed",
  "traceId": "abc-123-def",
  "service": "usage-metrics-api",
  "method": "POST",
  "path": "/v1/events",
  "statusCode": 201,
  "duration": 45
}
```

### Implementation
- Use Winston with JSON formatter
- Configure log level via environment variable
- Include request context in all logs

### CloudWatch Logs Insights Query Example
```
fields @timestamp, level, message, traceId
| filter traceId = "abc-123-def"
| sort @timestamp asc
```

### Files Created/Modified
- `src/utils/logger.js`

---

## Definition of Done

- [x] All logs in JSON format
- [x] Required fields present
- [x] Trace ID included in logs
- [x] Log levels working correctly
- [x] Sample queries documented

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
