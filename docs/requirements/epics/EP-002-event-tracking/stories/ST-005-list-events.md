# ST-005: List Events with Filters

**Epic:** [EP-002: Event Tracking](../README.md)
**Story Points:** 4
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As an** analyst
**I want** to query events with filters
**So that** I can retrieve specific subsets of usage data

---

## Acceptance Criteria

### AC1: List All Events
- **Given** events exist in the system
- **When** I GET /v1/events without filters
- **Then** I receive all events (paginated)

### AC2: Filter by Entity
- **Given** events exist for multiple entities
- **When** I GET /v1/events?entityId=user-123
- **Then** I receive only events for that entity

### AC3: Filter by Event Type
- **Given** events of multiple types exist
- **When** I GET /v1/events?eventType=feature_used
- **Then** I receive only events of that type

### AC4: Filter by Date Range
- **Given** events exist across different dates
- **When** I GET /v1/events?startDate=2026-01-01&endDate=2026-01-15
- **Then** I receive only events within that range

### AC5: Pagination
- **Given** more events exist than the limit
- **When** I GET /v1/events?limit=10&offset=10
- **Then** I receive the second page of results

---

## Technical Notes

### Implementation Approach
- Support query parameters: entityId, eventType, startDate, endDate, limit, offset
- Default limit: 100, max limit: 1000
- Return total count in response metadata
- Sort by timestamp descending (newest first)

### API Endpoints
- `GET /v1/events` - List events with optional filters

### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| entityId | string | Filter by entity |
| eventType | string | Filter by event type |
| startDate | ISO8601 | Start of date range |
| endDate | ISO8601 | End of date range |
| limit | integer | Max results (default 100) |
| offset | integer | Skip N results |

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] All filter combinations work correctly
- [x] Pagination works correctly
- [x] API documentation updated

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
