# ST-015: Secrets Management

**Epic:** [EP-005: Infrastructure as Code](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As a** security engineer
**I want** secrets managed via AWS Secrets Manager
**So that** sensitive values are never stored in code

---

## Acceptance Criteria

### AC1: No Secrets in Code
- **Given** the entire codebase
- **When** I search for secrets
- **Then** no API keys, passwords, or tokens are found

### AC2: Secrets Manager Integration
- **Given** the ECS task definition
- **When** I examine secret references
- **Then** they point to AWS Secrets Manager ARNs

### AC3: IAM Permissions
- **Given** the ECS task role
- **When** I check permissions
- **Then** it has secretsmanager:GetSecretValue for required secrets

### AC4: Environment Variables
- **Given** the application is running
- **When** it reads configuration
- **Then** secrets are available as environment variables

---

## Technical Notes

### Implementation Approach
- Define secrets in Secrets Manager (manually or via Terraform)
- Reference secrets in ECS task definition using `secrets` block
- ECS automatically injects secret values at container start

### Task Definition Example
```hcl
secrets = [
  {
    name      = "DATABASE_URL"
    valueFrom = "arn:aws:secretsmanager:region:account:secret:db-url"
  }
]
```

### Secrets Structure
| Secret Name | Purpose |
|-------------|---------|
| /app/database-url | Database connection string |
| /app/api-key | External API authentication |

---

## Definition of Done

- [x] No secrets in repository
- [x] Secrets Manager references in Terraform
- [x] IAM permissions configured
- [x] Application receives secrets as env vars
- [x] Documentation updated

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
