# ST-017: Alerting Configuration

**Epic:** [EP-006: Monitoring & Observability](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As an** on-call engineer
**I want** alerts when issues occur
**So that** I can respond before users are impacted

---

## Acceptance Criteria

### AC1: Error Rate Alert
- **Given** error rate exceeds 5%
- **When** for 2 consecutive data points
- **Then** alert fires with appropriate severity

### AC2: Latency Alert
- **Given** p99 latency exceeds 2 seconds
- **When** for 3 consecutive data points
- **Then** alert fires

### AC3: Health Check Alert
- **Given** health check fails
- **When** for 2 consecutive checks
- **Then** alert fires immediately

### AC4: Alert Notification
- **Given** an alert fires
- **When** notification is sent
- **Then** it includes: service name, metric, current value, threshold

---

## Technical Notes

### Alert Definitions
| Alert | Metric | Threshold | Evaluation Period |
|-------|--------|-----------|-------------------|
| High Error Rate | 5XX Count / Total | > 5% | 2 of 2 periods (1 min) |
| High Latency | TargetResponseTime p99 | > 2000ms | 3 of 3 periods (1 min) |
| Unhealthy Hosts | HealthyHostCount | < 1 | 2 of 2 periods (1 min) |
| High CPU | CPUUtilization | > 80% | 3 of 5 periods (1 min) |

### Alert Actions
- SNS topic for notifications
- Can integrate with PagerDuty, Slack, etc.

### Files Created/Modified
- `monitoring/alerts/cloudwatch-alarms.tf`

---

## Definition of Done

- [x] All alerts configured in Terraform
- [x] Thresholds tuned to avoid noise
- [x] Notification includes context
- [x] Alerts documented in runbook

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
