# ST-006: Event Validation

**Epic:** [EP-002: Event Tracking](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As an** API consumer
**I want** clear validation errors for invalid events
**So that** I can fix my requests and successfully record events

---

## Acceptance Criteria

### AC1: Required Fields
- **Given** entityId or eventType is missing
- **When** I POST to /v1/events
- **Then** I receive 400 Bad Request with field-specific error

### AC2: Field Format
- **Given** entityId contains invalid characters
- **When** I POST to /v1/events
- **Then** I receive 400 Bad Request with format error

### AC3: Metadata Validation
- **Given** metadata is not an object
- **When** I POST to /v1/events
- **Then** I receive 400 Bad Request

### AC4: Error Response Format
- **Given** validation fails
- **When** the error response is returned
- **Then** it includes: errors array with field, message, and value

---

## Technical Notes

### Implementation Approach
- Use express-validator for declarative validation
- Validate at route level before reaching service
- Return structured error responses
- Include all validation errors (not just first)

### Error Response Format
```json
{
  "error": "Validation Error",
  "errors": [
    {
      "field": "entityId",
      "message": "entityId is required",
      "value": null
    }
  ]
}
```

### Validation Rules
| Field | Rules |
|-------|-------|
| entityId | Required, string, 1-255 chars, alphanumeric with - and _ |
| eventType | Required, string, 1-100 chars, alphanumeric with _ |
| metadata | Optional, object |

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests for all validation rules
- [x] Error messages are clear and actionable
- [x] Multiple errors returned in single response
- [x] API documentation includes error examples

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
