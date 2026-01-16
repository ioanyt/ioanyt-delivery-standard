# GitHub Project Board Setup Guide

This guide explains how to set up the GitHub Project board for sprint planning and tracking.

## Creating the Project Board

1. Go to the repository: https://github.com/ioanyt/ioanyt-delivery-standard
2. Click on "Projects" tab
3. Click "New project"
4. Select "Board" template
5. Name it: "Usage Metrics API - Sprint Planning"

## Recommended Columns

| Column | Purpose |
|--------|---------|
| Backlog | Stories not yet scheduled |
| Sprint 1 | Stories planned for Sprint 1 |
| Sprint 2 | Stories planned for Sprint 2 |
| In Progress | Currently being worked on |
| Review | Ready for review |
| Done | Completed |

## Adding Issues to Project

1. Open each issue (Epics and Stories)
2. In the right sidebar, click "Projects"
3. Select the project board
4. Drag issues to appropriate columns

## Custom Fields (Optional)

You can add custom fields to track:
- Story Points
- Sprint
- Priority
- Epic (for stories)

### To Add Custom Fields:

1. Open the project board
2. Click the dropdown arrow next to any field
3. Select "+ New field"
4. Choose field type (Number, Single select, etc.)

## Views to Create

### Sprint View
- Group by: Sprint column
- Sort by: Priority

### Epic View
- Filter: label:epic
- Sort by: Sprint

### Burndown View
- Filter: Sprint = current
- Group by: Status

## Automations

GitHub Projects supports automations:

1. **Auto-add issues**: Automatically add new issues to Backlog
2. **Auto-move on close**: Move to Done when issue is closed
3. **Auto-move on PR merge**: Move to Done when linked PR is merged

To configure:
1. Click "..." menu on project
2. Select "Workflows"
3. Enable desired automations

## Current Issues

**Total Issues:** 24 (6 Epics + 18 Stories)

### Epics (6)

| Issue | Epic | Sprint | Points |
|-------|------|--------|--------|
| #1 | EP-001: API Foundation | 1 | 8 |
| #2 | EP-002: Event Tracking | 1 | 10 |
| #3 | EP-003: Usage Analytics | 1 | 10 |
| #4 | EP-004: CI/CD Pipeline | 2 | 9 |
| #5 | EP-005: Infrastructure as Code | 2 | 10 |
| #6 | EP-006: Monitoring & Observability | 2 | 8 |

### Sprint 1 Stories (9 stories, 28 points)

| Issue | Story | Epic | Points |
|-------|-------|------|--------|
| #7 | ST-001: Express Application Setup | #1 | 3 |
| #8 | ST-002: Health Check Endpoints | #1 | 2 |
| #10 | ST-003: Request Tracking Middleware | #1 | 3 |
| #11 | ST-004: Record Usage Events | #2 | 3 |
| #12 | ST-005: List Events with Filters | #2 | 4 |
| #13 | ST-006: Event Validation | #2 | 3 |
| #14 | ST-007: Usage Summary per Entity | #3 | 3 |
| #15 | ST-008: Usage History Time-Series | #3 | 4 |
| #16 | ST-009: Overall Statistics | #3 | 3 |

### Sprint 2 Stories (9 stories, 27 points)

| Issue | Story | Epic | Points |
|-------|-------|------|--------|
| #9 | ST-010: CI Workflow | #4 | 3 |
| #17 | ST-011: CD Staging Workflow | #4 | 3 |
| #18 | ST-012: CD Production Workflow | #4 | 3 |
| #19 | ST-013: Terraform Modules | #5 | 4 |
| #20 | ST-014: Environment Configurations | #5 | 3 |
| #21 | ST-015: Secrets Management | #5 | 3 |
| #22 | ST-016: CloudWatch Dashboard | #6 | 3 |
| #23 | ST-017: Alerting Configuration | #6 | 3 |
| #24 | ST-018: Structured Logging | #6 | 2 |

## Labels

The following labels have been created:

| Label | Color | Purpose |
|-------|-------|---------|
| epic | Purple | Epic issues |
| story | Blue | User story issues |
| sprint-1 | Green | Sprint 1 scope |
| sprint-2 | Yellow | Sprint 2 scope |
| P0 | Red | Critical priority |
| P1 | Orange | High priority |
| done | Teal | Completed items |

## Issue Templates

Issue templates are available in `.github/ISSUE_TEMPLATE/`:
- `epic.md` - Template for creating new epics
- `story.md` - Template for creating new user stories

---

**Last Updated:** 2026-01-16
