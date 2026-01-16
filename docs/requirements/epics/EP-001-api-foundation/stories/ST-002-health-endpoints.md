# ST-002: Health Check Endpoints

**Epic:** [EP-001: API Foundation](../README.md)
**Story Points:** 2
**Priority:** P0
**Sprint:** Sprint 1
**Status:** Done

---

## User Story

**As a** platform operator
**I want** health and readiness endpoints
**So that** container orchestrators can manage application lifecycle

---

## Acceptance Criteria

### AC1: Liveness Probe
- **Given** the application is running
- **When** I call GET /health
- **Then** I receive 200 OK with status: "healthy"

### AC2: Readiness Probe
- **Given** the application is running and dependencies are available
- **When** I call GET /ready
- **Then** I receive 200 OK with status: "ready"

### AC3: Dependency Check
- **Given** a dependency is unavailable
- **When** I call GET /ready
- **Then** I receive 503 Service Unavailable with details

### AC4: Response Format
- **Given** any health endpoint is called
- **When** the response is returned
- **Then** it includes: status, timestamp, version, and uptime

---

## Technical Notes

### Implementation Approach
- Implement /health for simple liveness (always returns OK if process running)
- Implement /ready for readiness (checks dependencies)
- Include service metadata in responses
- Use consistent JSON response format

### API Endpoints
- `GET /health` - Liveness probe
- `GET /ready` - Readiness probe

### Files Created/Modified
- `src/routes/health.js` - Health route handlers

---

## Definition of Done

- [x] Code implemented and reviewed
- [x] Unit tests written (>80% coverage)
- [x] Endpoints return correct status codes
- [x] Response includes all required fields
- [x] Documentation updated

---

## Testing Notes

### Unit Tests
- [x] Health endpoint returns 200
- [x] Ready endpoint returns 200 when healthy
- [x] Response includes required fields

### Integration Tests
- [x] Endpoints accessible without authentication
- [x] Correct content-type header

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
