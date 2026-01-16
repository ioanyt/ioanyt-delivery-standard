# ST-010: CI Workflow

**Epic:** [EP-004: CI/CD Pipeline](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** developer
**I want** automated quality checks on every PR
**So that** code quality issues are caught before merge

---

## Acceptance Criteria

### AC1: Trigger on PR
- **Given** a pull request is opened or updated
- **When** the workflow runs
- **Then** all checks execute automatically

### AC2: Linting
- **Given** the CI workflow runs
- **When** ESLint executes
- **Then** linting errors fail the build

### AC3: Testing
- **Given** the CI workflow runs
- **When** Jest executes
- **Then** test failures fail the build

### AC4: Security Scanning
- **Given** the CI workflow runs
- **When** npm audit executes
- **Then** critical vulnerabilities fail the build

### AC5: Coverage Threshold
- **Given** tests pass
- **When** coverage is below 80%
- **Then** the build fails

---

## Technical Notes

### Implementation Approach
- Trigger on pull_request and push to main
- Run jobs in parallel where possible
- Cache npm dependencies
- Upload coverage reports

### Workflow Steps
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (cached)
4. Run linting
5. Run tests with coverage
6. Run security audit

### Files Created/Modified
- `.github/workflows/ci.yml`

---

## Definition of Done

- [x] Workflow triggers on PR and push
- [x] All quality checks implemented
- [x] Build fails on any check failure
- [x] Caching working for dependencies
- [x] Status visible in PR checks

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
