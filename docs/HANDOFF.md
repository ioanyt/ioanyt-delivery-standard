# Handoff Guide

## Purpose

This document provides everything your team needs to take ownership of the Usage Metrics API. After reading this guide, you should be able to:

- Deploy changes independently
- Monitor and troubleshoot the service
- Extend the functionality
- Scale the infrastructure

## Getting Started

### Prerequisites

- Node.js 20+
- AWS CLI configured with appropriate permissions
- Terraform 1.6+
- Docker (for local container testing)

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/ioanyt/ioanyt-delivery-standard.git
cd ioanyt-delivery-standard

# Install dependencies
npm install

# Start in development mode
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `PORT` | No | 3000 | Server port |
| `NODE_ENV` | No | development | Environment (development/staging/production) |
| `LOG_LEVEL` | No | info | Logging level (error/warn/info/debug) |
| `LOG_FORMAT` | No | json | Log format (json/simple) |
| `MAX_EVENTS` | No | 10000 | Maximum events in memory |
| `RETENTION_MS` | No | 86400000 | Event retention (24h default) |

## Architecture Overview

```
src/
├── index.js          # Entry point, server startup
├── app.js            # Express app configuration
├── config.js         # Configuration management
├── routes/
│   ├── events.js     # POST/GET /v1/events
│   ├── usage.js      # GET /v1/usage/*
│   └── health.js     # GET /health, /ready, /info
├── services/
│   └── usageService.js  # Core business logic
├── middleware/
│   ├── requestTracker.js  # Trace IDs + self-tracking
│   └── errorHandler.js    # Centralized error handling
└── utils/
    └── logger.js     # Winston logger configuration
```

### Key Files to Understand

1. **src/services/usageService.js** - All business logic lives here
2. **src/middleware/requestTracker.js** - Self-tracking implementation
3. **src/app.js** - Middleware chain and route mounting
4. **infrastructure/terraform/environments/** - Infrastructure configs

## Deployment

### CI/CD Pipeline

The project uses GitHub Actions for CI/CD:

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | Push/PR to main | Lint, test, security scan |
| `cd-staging.yml` | Push to main | Auto-deploy to staging |
| `cd-prod.yml` | Release/Manual | Deploy to production (with approval) |

### Manual Deployment

```bash
# Deploy to staging
cd infrastructure/terraform/environments/staging
terraform init
terraform plan -var="image_tag=v1.2.3"
terraform apply

# Deploy to production
cd infrastructure/terraform/environments/prod
terraform init
terraform plan -var="image_tag=v1.2.3"
# Requires approval
terraform apply
```

### Rollback

```bash
# Find previous task definition
aws ecs list-task-definitions --family-prefix delivery-standard --sort DESC

# Rollback to previous version
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --task-definition delivery-standard:<previous-revision>
```

## Monitoring

### Dashboards

- **CloudWatch Dashboard**: `delivery-standard-prod`
- **Key Metrics**: Request count, error rate, latency, CPU/memory

### Alerts

| Alert | Threshold | Action |
|-------|-----------|--------|
| High Error Rate | >5% for 2 min | Check logs, recent deployments |
| High Latency | p95 >1s for 3 min | Check resources, scale if needed |
| Unhealthy Hosts | Any | ECS auto-replaces, monitor |
| No Healthy Hosts | 0 | Critical - investigate immediately |

### Log Queries

```
# CloudWatch Logs Insights - Recent errors
fields @timestamp, @message
| filter @message like /error/i
| sort @timestamp desc
| limit 50
```

## Extending the Service

### Adding a New Endpoint

1. Create route file in `src/routes/`
2. Add validation using `express-validator`
3. Implement business logic in `src/services/`
4. Mount route in `src/app.js`
5. Add tests in `tests/`

**Example:**

```javascript
// src/routes/newFeature.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'New feature' });
});

module.exports = router;

// In src/app.js
const newFeatureRoutes = require('./routes/newFeature');
app.use('/v1/new-feature', newFeatureRoutes);
```

### Adding Persistent Storage

The current implementation uses in-memory storage. To add DynamoDB:

1. Add AWS SDK: `npm install @aws-sdk/client-dynamodb`
2. Create DynamoDB table in Terraform
3. Update `usageService.js` to use DynamoDB client
4. Add IAM permissions to task role

### Adding Authentication

1. Create middleware in `src/middleware/auth.js`
2. Implement API key or JWT validation
3. Apply to routes that need protection
4. Store keys in AWS Secrets Manager

## Infrastructure

### AWS Resources

| Resource | Purpose |
|----------|---------|
| VPC | Network isolation |
| ALB | Load balancing, SSL termination |
| ECS Cluster | Container orchestration |
| ECS Service | Service management, scaling |
| ECR | Container image registry |
| CloudWatch | Logs, metrics, alarms |

### Scaling

Auto-scaling is configured based on:
- CPU utilization > 70% → Scale out
- Memory utilization > 80% → Scale out
- Cooldown: 5 minutes (scale in), 1 minute (scale out)

Manual scaling:
```bash
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --desired-count 4
```

## Security Considerations

### Current Implementation

- Helmet for security headers
- CORS configured
- Input validation on all endpoints
- Non-root Docker user
- Private subnets for tasks

### Production Recommendations

1. Add API authentication (API keys or JWT)
2. Enable WAF on ALB
3. Implement rate limiting
4. Add secrets management (AWS Secrets Manager)
5. Enable VPC Flow Logs

## Support

### Documentation

- [Architecture](ARCHITECTURE.md) - System design
- [API](API.md) - API reference
- [Runbook](RUNBOOK.md) - Operations procedures

### Getting Help

If you encounter issues not covered in documentation:

1. Check the runbook for common issues
2. Review CloudWatch logs
3. Contact IOanyT support (during support period)

## Checklist: You're Ready When...

- [ ] Local development environment working
- [ ] Can run tests successfully
- [ ] Understand the deployment process
- [ ] Have access to AWS console
- [ ] Know how to view logs and metrics
- [ ] Reviewed the runbook
- [ ] Completed walkthrough session with IOanyT

---

**Congratulations!** You now have everything you need to own and operate this service.

*IOanyT - Production-Ready Delivery*
