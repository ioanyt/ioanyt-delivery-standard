# Operations Runbook

## Overview

This runbook provides procedures for operating and troubleshooting the Usage Metrics API in production.

## Quick Reference

| Action | Command/Link |
|--------|--------------|
| View logs | CloudWatch Logs → `/ecs/delivery-standard-prod` |
| View metrics | CloudWatch Dashboard → `delivery-standard-prod` |
| View alerts | CloudWatch Alarms → Filter by `delivery-standard` |
| Restart service | ECS → Force new deployment |
| Scale manually | ECS → Update service desired count |

## Health Checks

### Check Service Status

```bash
# Via curl
curl https://api.example.com/health

# Via AWS CLI
aws ecs describe-services \
  --cluster ioanyt-prod \
  --services delivery-standard \
  --query 'services[0].{status:status,running:runningCount,desired:desiredCount}'
```

### Expected Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "ioanyt-delivery-standard",
  "version": "1.0.0"
}
```

## Common Issues

### Issue: High Error Rate (>5%)

**Symptoms:**
- CloudWatch alarm `delivery-standard-prod-high-error-rate` triggered
- Increased 5xx responses in ALB metrics

**Diagnosis:**

1. Check recent logs for errors:
```
CloudWatch Logs Insights:
fields @timestamp, @message
| filter @message like /error|Error|ERROR/
| sort @timestamp desc
| limit 100
```

2. Check if specific endpoint is failing:
```
fields @timestamp, @message
| filter @message like /error/
| stats count() by path
```

3. Check ECS task health:
```bash
aws ecs describe-tasks \
  --cluster ioanyt-prod \
  --tasks $(aws ecs list-tasks --cluster ioanyt-prod --service-name delivery-standard --query 'taskArns[]' --output text)
```

**Resolution:**

1. If specific endpoint failing → Check code for that route
2. If all endpoints failing → Check memory/CPU, consider scaling
3. If tasks restarting → Check for OOM, increase memory
4. If external dependency failing → Check connectivity, circuit break

### Issue: High Latency (p95 > 1s)

**Symptoms:**
- CloudWatch alarm `delivery-standard-prod-high-latency` triggered
- User complaints about slow responses

**Diagnosis:**

1. Check which endpoints are slow:
```
CloudWatch Logs Insights:
fields @timestamp, path, duration
| filter duration > 1000
| stats avg(duration), max(duration), count() by path
```

2. Check resource utilization:
- CPU > 80% → Scale out or optimize code
- Memory > 85% → Memory leak or need more memory

3. Check concurrent connections:
```
CloudWatch Metrics:
AWS/ApplicationELB → ActiveConnectionCount
```

**Resolution:**

1. High CPU → Scale out (increase desired count)
2. Memory leak → Force new deployment (rolls tasks)
3. Code issue → Identify slow endpoint, optimize
4. Too many connections → Increase max capacity

### Issue: Unhealthy Hosts

**Symptoms:**
- CloudWatch alarm `delivery-standard-prod-unhealthy-hosts` triggered
- ALB showing unhealthy targets

**Diagnosis:**

1. Check target group health:
```bash
aws elbv2 describe-target-health \
  --target-group-arn <target-group-arn>
```

2. Check ECS task logs for the unhealthy task:
```
CloudWatch Logs:
Filter by task ID from unhealthy target
```

3. Check if health endpoint is responding:
```bash
# From inside VPC or bastion
curl http://<task-private-ip>:3000/health
```

**Resolution:**

1. If task crashed → ECS will auto-replace
2. If health check timing out → Check security groups
3. If /health returns error → Check application logs
4. If consistent failures → Check recent deployments, rollback if needed

### Issue: No Traffic / Zero Requests

**Symptoms:**
- CloudWatch alarm `delivery-standard-prod-low-requests` triggered
- No requests in ALB metrics

**Diagnosis:**

1. Check ALB is receiving traffic:
```
CloudWatch Metrics:
AWS/ApplicationELB → RequestCount
```

2. Check DNS resolution:
```bash
nslookup api.example.com
```

3. Check ALB listeners:
```bash
aws elbv2 describe-listeners --load-balancer-arn <alb-arn>
```

4. Check security groups allow inbound traffic

**Resolution:**

1. DNS issue → Check Route53/DNS provider
2. ALB issue → Check listeners, target groups
3. Security group → Ensure 443/80 open from 0.0.0.0/0
4. Certificate issue → Check ACM certificate status

## Operational Procedures

### Deploy New Version

Deployments are automated via GitHub Actions. Manual deployment:

```bash
# 1. Build and push image
docker build -t <ecr-repo>:v1.2.3 .
docker push <ecr-repo>:v1.2.3

# 2. Update Terraform
cd infrastructure/terraform/environments/prod
terraform plan -var="image_tag=v1.2.3"
terraform apply

# 3. Force new deployment
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --force-new-deployment

# 4. Monitor deployment
aws ecs wait services-stable \
  --cluster ioanyt-prod \
  --services delivery-standard
```

### Rollback Deployment

```bash
# 1. Find previous task definition
aws ecs list-task-definitions \
  --family-prefix delivery-standard \
  --sort DESC \
  --max-items 5

# 2. Update service to previous version
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --task-definition delivery-standard:<previous-revision>

# 3. Wait for rollback
aws ecs wait services-stable \
  --cluster ioanyt-prod \
  --services delivery-standard
```

### Scale Service

```bash
# Scale out (increase capacity)
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --desired-count 4

# Scale in (decrease capacity)
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --desired-count 2

# Note: Auto-scaling will adjust within min/max bounds
```

### Force Restart All Tasks

```bash
aws ecs update-service \
  --cluster ioanyt-prod \
  --service delivery-standard \
  --force-new-deployment
```

### View Logs

**CloudWatch Console:**
1. Go to CloudWatch → Logs → Log groups
2. Select `/ecs/delivery-standard-prod`
3. Use Logs Insights for queries

**Common Queries:**

```
# Recent errors
fields @timestamp, @message
| filter @message like /error|Error|ERROR/
| sort @timestamp desc
| limit 50

# Requests by endpoint
fields @timestamp, method, path, statusCode, duration
| stats count() as requests, avg(duration) as avgDuration by path
| sort requests desc

# Slow requests
fields @timestamp, method, path, duration, traceId
| filter duration > 500
| sort @timestamp desc
| limit 50

# Requests by trace ID
fields @timestamp, @message
| filter traceId = "abc-123-def"
| sort @timestamp asc
```

## Alerting Contacts

| Severity | Channel | Response Time |
|----------|---------|---------------|
| Critical (no healthy hosts) | PagerDuty | Immediate |
| High (error rate, latency) | Slack #alerts | 15 minutes |
| Medium (high CPU/memory) | Slack #alerts | 1 hour |
| Low (informational) | Email | Next business day |

## Maintenance Windows

- **Preferred**: Sundays 02:00-06:00 UTC
- **Blackout periods**: None (service should be always available)
- **Change freeze**: Last week of each quarter

## Escalation Path

1. **L1**: On-call engineer (PagerDuty)
2. **L2**: Senior engineer / Tech lead
3. **L3**: CTO / Platform team

## Related Documentation

- [Architecture](ARCHITECTURE.md)
- [API Documentation](API.md)
- [Handoff Guide](HANDOFF.md)
