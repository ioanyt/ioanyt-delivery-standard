# ST-013: Terraform Modules

**Epic:** [EP-005: Infrastructure as Code](../README.md)
**Story Points:** 4
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** DevOps engineer
**I want** reusable Terraform modules
**So that** I can provision consistent infrastructure across environments

---

## Acceptance Criteria

### AC1: ECS Service Module
- **Given** the ecs-service module
- **When** I apply it with required variables
- **Then** ECS service, task definition, and ALB are created

### AC2: Module Inputs
- **Given** the module definition
- **When** I examine variables.tf
- **Then** all configurable options are documented with descriptions

### AC3: Module Outputs
- **Given** the module is applied
- **When** I need resource references
- **Then** outputs provide ALB DNS, service ARN, etc.

### AC4: Auto-scaling
- **Given** the ECS service is deployed
- **When** CPU exceeds threshold
- **Then** service scales up automatically

---

## Technical Notes

### Module Structure
```
modules/ecs-service/
├── main.tf         # Resources
├── variables.tf    # Input variables
├── outputs.tf      # Output values
```

### Key Variables
| Variable | Type | Description |
|----------|------|-------------|
| service_name | string | Name of the ECS service |
| container_image | string | Docker image to deploy |
| container_port | number | Port the container listens on |
| cpu | number | CPU units (256, 512, 1024, etc.) |
| memory | number | Memory in MB |
| desired_count | number | Number of tasks |

### Resources Created
- ECS Task Definition
- ECS Service
- ALB Target Group
- ALB Listener Rules
- Auto-scaling Target
- Auto-scaling Policies

---

## Definition of Done

- [x] Module provisions all required resources
- [x] Variables documented with descriptions
- [x] Outputs expose necessary values
- [x] Auto-scaling configured
- [x] Module tested in staging

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
