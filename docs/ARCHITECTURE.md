# Architecture Documentation

## Overview

The Usage Metrics API is a RESTful service that records and retrieves usage events. It's designed as a self-tracking system - the API records its own usage, making it a self-demonstrating reference implementation.

## System Architecture

```
                                    ┌─────────────────────────────────────────────────────┐
                                    │                      AWS Cloud                       │
                                    │                                                      │
┌──────────┐     HTTPS      ┌───────┴───────┐         ┌─────────────────┐                 │
│  Client  │ ──────────────▶│      ALB      │────────▶│   ECS Fargate   │                 │
└──────────┘                │ (Load Balancer)│         │  ┌───────────┐  │                 │
                            └───────┬───────┘         │  │  Task 1   │  │                 │
                                    │                 │  └───────────┘  │                 │
                                    │                 │  ┌───────────┐  │                 │
                                    │                 │  │  Task 2   │  │                 │
                                    │                 │  └───────────┘  │                 │
                                    │                 └────────┬────────┘                 │
                                    │                          │                          │
                                    │                          ▼                          │
                                    │                 ┌─────────────────┐                 │
                                    │                 │   CloudWatch    │                 │
                                    │                 │  Logs & Metrics │                 │
                                    │                 └─────────────────┘                 │
                                    └─────────────────────────────────────────────────────┘
```

## Component Design

### Application Layer

```
┌─────────────────────────────────────────────────────────────────┐
│                         Express App                              │
├─────────────────────────────────────────────────────────────────┤
│  Middleware Stack                                                │
│  ┌─────────┐ ┌──────┐ ┌───────────┐ ┌─────────────┐ ┌────────┐ │
│  │ Helmet  │→│ CORS │→│Compression│→│RequestTracker│→│ Morgan │ │
│  └─────────┘ └──────┘ └───────────┘ └─────────────┘ └────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Routes                                                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ /v1/events   │ │ /v1/usage    │ │ /health      │            │
│  └──────┬───────┘ └──────┬───────┘ └──────────────┘            │
│         │                │                                       │
│         ▼                ▼                                       │
│  ┌─────────────────────────────────────────┐                    │
│  │           Usage Service                  │                    │
│  │  - recordEvent()                        │                    │
│  │  - getUsageSummary()                    │                    │
│  │  - getUsageHistory()                    │                    │
│  │  - getStats()                           │                    │
│  └─────────────────────────────────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│  Error Handling                                                  │
│  ┌──────────────────┐ ┌──────────────────┐                     │
│  │ notFoundHandler  │ │   errorHandler   │                     │
│  └──────────────────┘ └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Request arrives** at ALB (Application Load Balancer)
2. **Health check** validates target is healthy
3. **Request forwarded** to ECS task
4. **Middleware chain** processes request:
   - Helmet adds security headers
   - CORS handles cross-origin requests
   - Compression reduces response size
   - RequestTracker assigns trace ID and logs request
5. **Route handler** processes business logic
6. **Usage Service** records/retrieves data
7. **Self-tracking**: Every API call is recorded as a usage event
8. **Response** sent back through middleware chain

## Key Design Decisions

### 1. In-Memory Storage

**Decision**: Use in-memory storage for demo purposes.

**Rationale**:
- Simplifies deployment (no database dependency)
- Demonstrates data patterns without infrastructure complexity
- Self-contained reference implementation

**Production Consideration**:
Replace with DynamoDB, TimescaleDB, or InfluxDB for persistence.

### 2. Self-Tracking Pattern

**Decision**: The API tracks its own usage.

**Rationale**:
- Self-demonstrating system
- No external dependencies for demo
- Shows real usage patterns immediately

**Implementation**:
The `requestTracker` middleware records each API call as a usage event for entity `api-self`.

### 3. Stateless Design

**Decision**: No server-side session state.

**Rationale**:
- Enables horizontal scaling
- Simplifies deployment (any task can handle any request)
- Aligns with 12-factor app principles

### 4. Structured Logging

**Decision**: JSON-formatted logs with trace IDs.

**Rationale**:
- Easy aggregation in CloudWatch Logs Insights
- Request correlation across services
- Production-grade observability

## Infrastructure Architecture

### Network Design

```
VPC (10.0.0.0/16)
├── Public Subnets (10.0.101.0/24, 10.0.102.0/24)
│   ├── ALB
│   └── NAT Gateway
└── Private Subnets (10.0.1.0/24, 10.0.2.0/24)
    └── ECS Tasks
```

### Security Groups

| Security Group | Inbound | Outbound |
|----------------|---------|----------|
| ALB | 80, 443 from 0.0.0.0/0 | All to VPC |
| ECS Tasks | 3000 from ALB SG | All (for external APIs) |

### Scaling Strategy

- **Minimum**: 1 task (staging), 2 tasks (production)
- **Maximum**: 10 tasks (staging), 20 tasks (production)
- **CPU target**: 70% utilization triggers scale-out
- **Memory target**: 80% utilization triggers scale-out
- **Scale-in cooldown**: 5 minutes (prevents thrashing)

## Data Flow

### Event Recording

```
Client                    API                     UsageService
  │                        │                           │
  │  POST /v1/events       │                           │
  │ ───────────────────▶   │                           │
  │                        │  recordEvent()            │
  │                        │ ─────────────────────▶    │
  │                        │                           │  - Generate UUID
  │                        │                           │  - Add timestamp
  │                        │                           │  - Store in memory
  │                        │                           │  - Enforce limits
  │                        │   Event object            │
  │                        │ ◀─────────────────────    │
  │  201 Created           │                           │
  │ ◀───────────────────   │                           │
```

### Usage Retrieval

```
Client                    API                     UsageService
  │                        │                           │
  │  GET /v1/usage/:id     │                           │
  │ ───────────────────▶   │                           │
  │                        │  getUsageSummary()        │
  │                        │ ─────────────────────▶    │
  │                        │                           │  - Filter by entity
  │                        │                           │  - Apply time range
  │                        │                           │  - Aggregate by type
  │                        │   Summary object          │
  │                        │ ◀─────────────────────    │
  │  200 OK                │                           │
  │ ◀───────────────────   │                           │
```

## Error Handling Strategy

### Error Categories

| Category | HTTP Code | Handling |
|----------|-----------|----------|
| Validation | 400 | Return specific field errors |
| Not Found | 404 | Standard not found message |
| Internal | 500 | Log full error, return generic message |

### Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "entityId is required",
    "traceId": "abc-123-def"
  }
}
```

## Observability

### Logging

- **Format**: JSON (production), Simple (development)
- **Levels**: error, warn, info, debug
- **Correlation**: x-trace-id header propagated through all logs

### Metrics

| Metric | Source | Alert Threshold |
|--------|--------|-----------------|
| Request count | ALB | N/A (informational) |
| Error rate | ALB | > 5% |
| Latency p95 | ALB | > 1s |
| CPU utilization | ECS | > 85% |
| Memory utilization | ECS | > 90% |
| Healthy host count | ALB | < 1 |

### Tracing

Request tracing via `x-trace-id` header:
- Auto-generated if not provided
- Included in all log entries
- Returned in response headers
- Enables request correlation across services

## Future Considerations

### Potential Enhancements

1. **Persistent Storage**: DynamoDB for event storage
2. **Caching**: Redis for frequently accessed summaries
3. **API Gateway**: Rate limiting, API keys
4. **Event Streaming**: Kinesis for real-time processing
5. **Multi-Region**: Global deployment with Route53

### Migration Path

This reference implementation is designed to evolve:

1. **Phase 1** (Current): In-memory, single region
2. **Phase 2**: Add DynamoDB, maintain same API
3. **Phase 3**: Add caching layer
4. **Phase 4**: Multi-region deployment

The API contract remains stable through all phases.
