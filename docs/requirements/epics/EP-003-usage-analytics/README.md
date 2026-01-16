# EP-003: Usage Analytics

**Business Value:** Provide aggregated usage insights and historical trends
**Total Story Points:** 10 points
**Stories:** 3 stories
**Sprint:** Sprint 1
**Status:** Done

---

## Description

This epic builds the analytics layer on top of event tracking. It provides aggregated views of usage data including summaries per entity, time-series history, and overall statistics.

Key deliverables include:
- Usage summary per entity (total events, unique types, date range)
- Time-series history with configurable granularity
- Overall system statistics

---

## Success Criteria

- [x] Usage summary available for any entity
- [x] Historical data with daily/hourly granularity
- [x] Overall statistics endpoint functional
- [x] Efficient aggregation (no N+1 queries)

---

## Stories (3 stories, 10 points)

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| [ST-007](stories/ST-007-usage-summary.md) | Usage Summary per Entity | 3 | P0 | Done |
| [ST-008](stories/ST-008-usage-history.md) | Usage History Time-Series | 4 | P0 | Done |
| [ST-009](stories/ST-009-overall-stats.md) | Overall Statistics | 3 | P1 | Done |

---

## Dependencies

### Depends On
- EP-002: Event Tracking (data source)

### Required By
- None (terminal epic for analytics)

---

## Technical Scope

### Components Affected
- `src/routes/usage.js` - Usage route handlers
- `src/services/usageService.js` - Aggregation logic

### Key Technologies
- JavaScript reduce/filter for aggregation
- ISO8601 date handling

---

**Created:** 2026-01-16
**Last Updated:** 2026-01-16
