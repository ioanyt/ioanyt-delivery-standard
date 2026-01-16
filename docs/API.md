# API Documentation

## Base URL

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:3000` |
| Staging | `https://staging-api.example.com` |
| Production | `https://api.example.com` |

## Authentication

This reference implementation does not include authentication. In production, add:
- API Key authentication
- JWT tokens
- OAuth 2.0

## Common Headers

### Request Headers

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes (POST) | `application/json` |
| `x-trace-id` | No | Custom trace ID for request correlation |

### Response Headers

| Header | Description |
|--------|-------------|
| `x-trace-id` | Trace ID for the request (auto-generated if not provided) |
| `Content-Type` | Always `application/json` |

## Error Response Format

All errors follow this format:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "traceId": "abc-123-def"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request parameters |
| `NOT_FOUND` | 404 | Resource not found |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Endpoints

### Health Checks

#### GET /health

Liveness probe - returns 200 if service is running.

**Response**

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "ioanyt-delivery-standard",
  "version": "1.0.0"
}
```

#### GET /ready

Readiness probe - returns 200 if service can accept traffic.

**Response**

```json
{
  "status": "ready",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "checks": {
    "service": "ok"
  }
}
```

#### GET /info

Service information and statistics.

**Response**

```json
{
  "service": "ioanyt-delivery-standard",
  "version": "1.0.0",
  "environment": "production",
  "uptime": {
    "ms": 3600000,
    "human": "1h 0m"
  },
  "stats": {
    "totalEvents": 1250,
    "eventsLastHour": 150,
    "uniqueEntities": 45
  }
}
```

---

### Events API

#### POST /v1/events

Record a new usage event.

**Request Body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `entityId` | string | Yes | Entity identifier (user, org, api-key) |
| `eventType` | string | Yes | Type of event (api_call, file_upload, etc.) |
| `metadata` | object | No | Additional event data |

**Example Request**

```bash
curl -X POST https://api.example.com/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "entityId": "user_123",
    "eventType": "api_call",
    "metadata": {
      "endpoint": "/users",
      "method": "GET"
    }
  }'
```

**Response (201 Created)**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "entityId": "user_123",
    "eventType": "api_call",
    "metadata": {
      "endpoint": "/users",
      "method": "GET"
    },
    "timestamp": "2024-01-15T10:30:00.000Z",
    "createdAt": 1705314600000
  }
}
```

#### GET /v1/events

List events with optional filters.

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `entityId` | string | - | Filter by entity ID |
| `eventType` | string | - | Filter by event type |
| `limit` | integer | 100 | Max results (1-1000) |
| `offset` | integer | 0 | Pagination offset |

**Example Request**

```bash
curl "https://api.example.com/v1/events?entityId=user_123&limit=10"
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "entityId": "user_123",
        "eventType": "api_call",
        "metadata": {},
        "timestamp": "2024-01-15T10:30:00.000Z",
        "createdAt": 1705314600000
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### Usage API

#### GET /v1/usage/stats

Get overall service statistics.

**Example Request**

```bash
curl "https://api.example.com/v1/usage/stats"
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "totalEvents": 5000,
    "eventsLastHour": 250,
    "uniqueEntities": 100,
    "eventTypes": {
      "api_call": 4000,
      "file_upload": 800,
      "login": 200
    },
    "uptime": {
      "ms": 86400000,
      "human": "1d 0h"
    },
    "startTime": "2024-01-14T10:30:00.000Z"
  }
}
```

#### GET /v1/usage/:entityId

Get usage summary for a specific entity.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `entityId` | string | Entity identifier |

**Query Parameters**

| Parameter | Type | Format | Description |
|-----------|------|--------|-------------|
| `since` | string | ISO8601 | Start of time range |
| `until` | string | ISO8601 | End of time range |

**Example Request**

```bash
curl "https://api.example.com/v1/usage/user_123?since=2024-01-01T00:00:00Z"
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "entityId": "user_123",
    "totalEvents": 150,
    "byEventType": {
      "api_call": 120,
      "file_upload": 30
    },
    "period": {
      "since": "2024-01-01T00:00:00.000Z",
      "until": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

#### GET /v1/usage/:entityId/history

Get time-series usage data for an entity.

**Path Parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| `entityId` | string | Entity identifier |

**Query Parameters**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `since` | string | - | Start of time range (ISO8601) |
| `until` | string | - | End of time range (ISO8601) |
| `interval` | string | `hour` | Bucket interval: `minute`, `hour`, `day` |

**Example Request**

```bash
curl "https://api.example.com/v1/usage/user_123/history?interval=hour"
```

**Response (200 OK)**

```json
{
  "success": true,
  "data": {
    "entityId": "user_123",
    "interval": "hour",
    "dataPoints": [
      {"timestamp": "2024-01-15T08:00:00.000Z", "count": 25},
      {"timestamp": "2024-01-15T09:00:00.000Z", "count": 42},
      {"timestamp": "2024-01-15T10:00:00.000Z", "count": 18}
    ],
    "period": {
      "since": "2024-01-15T00:00:00.000Z",
      "until": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

---

## Rate Limits

This reference implementation does not include rate limiting. In production, consider:

| Tier | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Free | 60 | 10,000 |
| Pro | 600 | 100,000 |
| Enterprise | Unlimited | Unlimited |

## SDK Examples

### Node.js

```javascript
const axios = require('axios');

const client = axios.create({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Record an event
async function recordEvent(entityId, eventType, metadata = {}) {
  const response = await client.post('/v1/events', {
    entityId,
    eventType,
    metadata,
  });
  return response.data;
}

// Get usage summary
async function getUsage(entityId) {
  const response = await client.get(`/v1/usage/${entityId}`);
  return response.data;
}
```

### Python

```python
import requests

BASE_URL = "https://api.example.com"

def record_event(entity_id: str, event_type: str, metadata: dict = None):
    response = requests.post(
        f"{BASE_URL}/v1/events",
        json={
            "entityId": entity_id,
            "eventType": event_type,
            "metadata": metadata or {},
        },
    )
    response.raise_for_status()
    return response.json()

def get_usage(entity_id: str):
    response = requests.get(f"{BASE_URL}/v1/usage/{entity_id}")
    response.raise_for_status()
    return response.json()
```

### cURL

```bash
# Record an event
curl -X POST https://api.example.com/v1/events \
  -H "Content-Type: application/json" \
  -d '{"entityId": "user_123", "eventType": "api_call"}'

# Get usage
curl https://api.example.com/v1/usage/user_123

# Get history
curl "https://api.example.com/v1/usage/user_123/history?interval=hour"

# Health check
curl https://api.example.com/health
```
