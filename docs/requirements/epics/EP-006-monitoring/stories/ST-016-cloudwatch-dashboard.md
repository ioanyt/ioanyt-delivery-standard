# ST-016: CloudWatch Dashboard

**Epic:** [EP-006: Monitoring & Observability](../README.md)
**Story Points:** 3
**Priority:** P0
**Sprint:** Sprint 2
**Status:** Done

---

## User Story

**As an** operations engineer
**I want** a CloudWatch dashboard with key metrics
**So that** I can see system health at a glance

---

## Acceptance Criteria

### AC1: Dashboard Created
- **Given** the dashboard JSON definition
- **When** imported to CloudWatch
- **Then** dashboard renders all widgets correctly

### AC2: Key Metrics Visible
- **Given** the dashboard
- **When** I view it
- **Then** I see: request rate, error rate, latency p50/p95/p99, CPU, memory

### AC3: Time Range Selection
- **Given** the dashboard
- **When** I change the time range
- **Then** all widgets update consistently

### AC4: Environment Selector
- **Given** multiple environments exist
- **When** I view the dashboard
- **Then** I can filter by environment (staging/production)

---

## Technical Notes

### Dashboard Widgets
| Widget | Metric | Purpose |
|--------|--------|---------|
| Request Rate | ALB RequestCount | Traffic volume |
| Error Rate | ALB 5XX Count | Application errors |
| Latency | ALB TargetResponseTime | Response time distribution |
| CPU Utilization | ECS CPUUtilization | Resource usage |
| Memory | ECS MemoryUtilization | Resource usage |
| Task Count | ECS RunningTaskCount | Scaling status |

### Files Created/Modified
- `monitoring/dashboards/cloudwatch-dashboard.json`

---

## Definition of Done

- [x] Dashboard JSON exportable/importable
- [x] All key metrics displayed
- [x] Time range controls work
- [x] Dashboard documented in runbook

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
