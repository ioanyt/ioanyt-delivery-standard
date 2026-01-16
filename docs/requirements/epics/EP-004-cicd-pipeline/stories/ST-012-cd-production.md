# ST-012: CD Production Workflow

**Epic:** [EP-004: CI/CD Pipeline](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** release manager
**I want** manual approval before production deployment
**So that** we have control over what goes live

---

## Acceptance Criteria

### AC1: Manual Trigger
- **Given** the production workflow
- **When** I want to deploy
- **Then** I can manually trigger the workflow from GitHub Actions

### AC2: Approval Gate
- **Given** the workflow is triggered
- **When** it reaches the deploy step
- **Then** it pauses for manual approval from authorized user

### AC3: Environment Protection
- **Given** production environment is configured
- **When** deployment is attempted
- **Then** only approved reviewers can approve

### AC4: Same Image as Staging
- **Given** approval is granted
- **When** deployment executes
- **Then** the same image tested in staging is deployed

### AC5: Rollback Documentation
- **Given** production deployment completes
- **When** issues are discovered
- **Then** documented rollback procedure can be followed

---

## Technical Notes

### Implementation Approach
- Use workflow_dispatch for manual trigger
- GitHub Environments for approval gates
- Reference staging-tested image by SHA
- Include rollback procedure in runbook

### Environment Configuration
- Environment: `production`
- Required reviewers: 1+
- Wait timer: optional (e.g., 5 minutes)

### Files Created/Modified
- `.github/workflows/cd-prod.yml`

---

## Definition of Done

- [x] Manual trigger works from GitHub UI
- [x] Approval gate pauses deployment
- [x] Only authorized users can approve
- [x] Deployment uses staging-verified image
- [x] Rollback procedure documented

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
