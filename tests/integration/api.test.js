/**
 * API Integration Tests
 *
 * Tests the full API flow including:
 * - HTTP request/response
 * - Validation
 * - Error handling
 * - Self-tracking
 */

const request = require('supertest');

// Mock config
jest.mock('../../src/config', () => ({
  port: 3000,
  nodeEnv: 'test',
  app: {
    name: 'ioanyt-delivery-standard',
    version: '1.0.0',
  },
  logging: {
    level: 'error',
    format: 'simple',
  },
  usage: {
    maxEvents: 10000,
    retentionMs: 86400000,
  },
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
  },
}));

// Mock logger to reduce noise
jest.mock('../../src/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  logRequest: jest.fn(),
}));

const app = require('../../src/app');

describe('API Integration Tests', () => {
  describe('Health Endpoints', () => {
    describe('GET /health', () => {
      it('should return healthy status', async () => {
        const res = await request(app).get('/health');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('healthy');
        expect(res.body.service).toBe('ioanyt-delivery-standard');
        expect(res.body).toHaveProperty('timestamp');
      });
    });

    describe('GET /ready', () => {
      it('should return ready status', async () => {
        const res = await request(app).get('/ready');

        expect(res.status).toBe(200);
        expect(res.body.status).toBe('ready');
        expect(res.body.checks.service).toBe('ok');
      });
    });

    describe('GET /info', () => {
      it('should return service info', async () => {
        const res = await request(app).get('/info');

        expect(res.status).toBe(200);
        expect(res.body.service).toBe('ioanyt-delivery-standard');
        expect(res.body.version).toBe('1.0.0');
        expect(res.body).toHaveProperty('uptime');
        expect(res.body).toHaveProperty('stats');
      });
    });
  });

  describe('Root Endpoint', () => {
    describe('GET /', () => {
      it('should return service overview', async () => {
        const res = await request(app).get('/');

        expect(res.status).toBe(200);
        expect(res.body.service).toBe('ioanyt-delivery-standard');
        expect(res.body.api).toHaveProperty('events');
        expect(res.body.api).toHaveProperty('usage');
      });
    });
  });

  describe('Events API', () => {
    describe('POST /v1/events', () => {
      it('should create an event', async () => {
        const res = await request(app)
          .post('/v1/events')
          .send({
            entityId: 'user_123',
            eventType: 'api_call',
            metadata: { endpoint: '/test' },
          });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data.entityId).toBe('user_123');
        expect(res.body.data.eventType).toBe('api_call');
        expect(res.body.data).toHaveProperty('id');
        expect(res.body.data).toHaveProperty('timestamp');
      });

      it('should return validation error for missing entityId', async () => {
        const res = await request(app).post('/v1/events').send({
          eventType: 'api_call',
        });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
      });

      it('should return validation error for missing eventType', async () => {
        const res = await request(app).post('/v1/events').send({
          entityId: 'user_123',
        });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
      });

      it('should include trace ID in response', async () => {
        const res = await request(app).post('/v1/events').send({
          entityId: 'user_123',
          eventType: 'api_call',
        });

        expect(res.headers).toHaveProperty('x-trace-id');
      });

      it('should accept custom trace ID', async () => {
        const customTraceId = 'custom-trace-123';
        const res = await request(app).post('/v1/events').set('x-trace-id', customTraceId).send({
          entityId: 'user_123',
          eventType: 'api_call',
        });

        expect(res.headers['x-trace-id']).toBe(customTraceId);
      });
    });

    describe('GET /v1/events', () => {
      beforeEach(async () => {
        // Create test events
        await request(app)
          .post('/v1/events')
          .send({ entityId: 'test_user', eventType: 'test_event' });
      });

      it('should return events list', async () => {
        const res = await request(app).get('/v1/events');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data.events)).toBe(true);
        expect(res.body.data).toHaveProperty('pagination');
      });

      it('should support pagination', async () => {
        const res = await request(app).get('/v1/events').query({ limit: 5, offset: 0 });

        expect(res.status).toBe(200);
        expect(res.body.data.pagination.limit).toBe(5);
        expect(res.body.data.pagination.offset).toBe(0);
      });

      it('should filter by entityId', async () => {
        const res = await request(app).get('/v1/events').query({ entityId: 'test_user' });

        expect(res.status).toBe(200);
        res.body.data.events.forEach((event) => {
          expect(event.entityId).toBe('test_user');
        });
      });
    });
  });

  describe('Usage API', () => {
    beforeEach(async () => {
      // Create test events
      await request(app).post('/v1/events').send({ entityId: 'usage_test', eventType: 'api_call' });
      await request(app)
        .post('/v1/events')
        .send({ entityId: 'usage_test', eventType: 'file_upload' });
    });

    describe('GET /v1/usage/:entityId', () => {
      it('should return usage summary', async () => {
        const res = await request(app).get('/v1/usage/usage_test');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.entityId).toBe('usage_test');
        expect(res.body.data).toHaveProperty('totalEvents');
        expect(res.body.data).toHaveProperty('byEventType');
      });
    });

    describe('GET /v1/usage/:entityId/history', () => {
      it('should return usage history', async () => {
        const res = await request(app).get('/v1/usage/usage_test/history');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.entityId).toBe('usage_test');
        expect(Array.isArray(res.body.data.dataPoints)).toBe(true);
      });

      it('should support interval parameter', async () => {
        const res = await request(app)
          .get('/v1/usage/usage_test/history')
          .query({ interval: 'minute' });

        expect(res.status).toBe(200);
        expect(res.body.data.interval).toBe('minute');
      });
    });

    describe('GET /v1/usage/stats', () => {
      it('should return overall stats', async () => {
        const res = await request(app).get('/v1/usage/stats');

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toHaveProperty('totalEvents');
        expect(res.body.data).toHaveProperty('uniqueEntities');
        expect(res.body.data).toHaveProperty('uptime');
      });
    });
  });

  describe('Error Handling', () => {
    describe('404 Not Found', () => {
      it('should return 404 for unknown routes', async () => {
        const res = await request(app).get('/unknown/route');

        expect(res.status).toBe(404);
        expect(res.body.error.code).toBe('NOT_FOUND');
        expect(res.body.error).toHaveProperty('traceId');
      });
    });

    describe('Validation Errors', () => {
      it('should return 400 for invalid limit', async () => {
        const res = await request(app).get('/v1/events').query({ limit: -1 });

        expect(res.status).toBe(400);
        expect(res.body.error.code).toBe('VALIDATION_ERROR');
      });
    });
  });

  describe('Self-Tracking', () => {
    it('should track API calls to itself', async () => {
      // Make a request
      await request(app).post('/v1/events').send({ entityId: 'external_user', eventType: 'test' });

      // Check self-tracked events
      const res = await request(app).get('/v1/usage/api-self');

      expect(res.status).toBe(200);
      expect(res.body.data.totalEvents).toBeGreaterThan(0);
    });
  });
});
