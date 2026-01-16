# ST-011: CD Staging Workflow

**Epic:** [EP-004: CI/CD Pipeline](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** team lead
**I want** automatic deployment to staging on merge
**So that** the latest code is always available for testing

---

## Acceptance Criteria

### AC1: Trigger on Merge
- **Given** a PR is merged to main
- **When** the workflow detects the push
- **Then** staging deployment begins automatically

### AC2: Build Container
- **Given** the deployment workflow runs
- **When** Docker build executes
- **Then** a container image is created and pushed to ECR

### AC3: Deploy to ECS
- **Given** the container is in ECR
- **When** deployment executes
- **Then** ECS service is updated with new image

### AC4: Health Check
- **Given** deployment completes
- **When** health check runs
- **Then** workflow verifies /health returns 200

### AC5: Failure Notification
- **Given** deployment fails
- **When** the workflow completes
- **Then** team is notified via configured channel

---

## Technical Notes

### Implementation Approach
- Trigger on push to main (after merge)
- Build and tag Docker image with commit SHA
- Push to Amazon ECR
- Update ECS service task definition
- Wait for service stability
- Notify on success/failure

### AWS Resources Required
- ECR repository
- ECS cluster and service (staging)
- IAM role with deployment permissions

### Files Created/Modified
- `.github/workflows/cd-staging.yml`
- `Dockerfile`

---

## Definition of Done

- [x] Auto-deploy on merge to main
- [x] Container properly built and tagged
- [x] ECS service updated successfully
- [x] Health check validates deployment
- [x] Notifications configured

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
