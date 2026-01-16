/**
 * Usage Service Unit Tests
 */

// Mock config before requiring service
jest.mock('../../src/config', () => ({
  usage: {
    maxEvents: 100,
    retentionMs: 86400000,
  },
  logging: {
    level: 'error',
    format: 'simple',
  },
  app: {
    name: 'test',
    version: '1.0.0',
  },
}));

// Mock logger
jest.mock('../../src/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
}));

describe('UsageService', () => {
  let usageService;

  beforeEach(() => {
    // Clear module cache to get fresh instance
    jest.resetModules();
    usageService = require('../../src/services/usageService');
  });

  afterEach(() => {
    usageService.shutdown();
  });

  describe('recordEvent', () => {
    it('should record an event with required fields', () => {
      const event = usageService.recordEvent({
        entityId: 'user_123',
        eventType: 'api_call',
      });

      expect(event).toHaveProperty('id');
      expect(event.entityId).toBe('user_123');
      expect(event.eventType).toBe('api_call');
      expect(event).toHaveProperty('timestamp');
      expect(event).toHaveProperty('createdAt');
    });

    it('should include metadata when provided', () => {
      const event = usageService.recordEvent({
        entityId: 'user_123',
        eventType: 'api_call',
        metadata: { endpoint: '/users', method: 'GET' },
      });

      expect(event.metadata).toEqual({ endpoint: '/users', method: 'GET' });
    });

    it('should generate unique IDs for each event', () => {
      const event1 = usageService.recordEvent({
        entityId: 'user_123',
        eventType: 'api_call',
      });
      const event2 = usageService.recordEvent({
        entityId: 'user_123',
        eventType: 'api_call',
      });

      expect(event1.id).not.toBe(event2.id);
    });

    it('should enforce maxEvents limit', () => {
      // Record more than maxEvents (100)
      for (let i = 0; i < 110; i++) {
        usageService.recordEvent({
          entityId: `user_${i}`,
          eventType: 'api_call',
        });
      }

      const result = usageService.getEvents({ limit: 1000 });
      expect(result.pagination.total).toBe(100);
    });
  });

  describe('getUsageSummary', () => {
    beforeEach(() => {
      // Add test events
      usageService.recordEvent({ entityId: 'user_1', eventType: 'api_call' });
      usageService.recordEvent({ entityId: 'user_1', eventType: 'api_call' });
      usageService.recordEvent({ entityId: 'user_1', eventType: 'file_upload' });
      usageService.recordEvent({ entityId: 'user_2', eventType: 'api_call' });
    });

    it('should return summary for specific entity', () => {
      const summary = usageService.getUsageSummary('user_1');

      expect(summary.entityId).toBe('user_1');
      expect(summary.totalEvents).toBe(3);
      expect(summary.byEventType).toEqual({
        api_call: 2,
        file_upload: 1,
      });
    });

    it('should return empty summary for unknown entity', () => {
      const summary = usageService.getUsageSummary('unknown');

      expect(summary.totalEvents).toBe(0);
      expect(summary.byEventType).toEqual({});
    });

    it('should include period information', () => {
      const summary = usageService.getUsageSummary('user_1');

      expect(summary.period).toHaveProperty('since');
      expect(summary.period).toHaveProperty('until');
    });
  });

  describe('getUsageHistory', () => {
    beforeEach(() => {
      usageService.recordEvent({ entityId: 'user_1', eventType: 'api_call' });
      usageService.recordEvent({ entityId: 'user_1', eventType: 'api_call' });
    });

    it('should return history with dataPoints', () => {
      const history = usageService.getUsageHistory('user_1');

      expect(history.entityId).toBe('user_1');
      expect(history.interval).toBe('hour');
      expect(Array.isArray(history.dataPoints)).toBe(true);
    });

    it('should support different intervals', () => {
      const minuteHistory = usageService.getUsageHistory('user_1', { interval: 'minute' });
      const hourHistory = usageService.getUsageHistory('user_1', { interval: 'hour' });
      const dayHistory = usageService.getUsageHistory('user_1', { interval: 'day' });

      expect(minuteHistory.interval).toBe('minute');
      expect(hourHistory.interval).toBe('hour');
      expect(dayHistory.interval).toBe('day');
    });
  });

  describe('getEvents', () => {
    beforeEach(() => {
      for (let i = 0; i < 50; i++) {
        usageService.recordEvent({
          entityId: i % 2 === 0 ? 'user_1' : 'user_2',
          eventType: i % 3 === 0 ? 'api_call' : 'file_upload',
        });
      }
    });

    it('should return paginated events', () => {
      const result = usageService.getEvents({ limit: 10, offset: 0 });

      expect(result.events.length).toBe(10);
      expect(result.pagination.total).toBe(50);
      expect(result.pagination.hasMore).toBe(true);
    });

    it('should filter by entityId', () => {
      const result = usageService.getEvents({ entityId: 'user_1' });

      result.events.forEach((event) => {
        expect(event.entityId).toBe('user_1');
      });
    });

    it('should filter by eventType', () => {
      const result = usageService.getEvents({ eventType: 'api_call' });

      result.events.forEach((event) => {
        expect(event.eventType).toBe('api_call');
      });
    });

    it('should sort by timestamp descending', () => {
      const result = usageService.getEvents({ limit: 10 });

      for (let i = 1; i < result.events.length; i++) {
        expect(result.events[i - 1].createdAt).toBeGreaterThanOrEqual(
          result.events[i].createdAt
        );
      }
    });
  });

  describe('getStats', () => {
    it('should return service statistics', () => {
      usageService.recordEvent({ entityId: 'user_1', eventType: 'api_call' });
      usageService.recordEvent({ entityId: 'user_2', eventType: 'file_upload' });

      const stats = usageService.getStats();

      expect(stats.totalEvents).toBe(2);
      expect(stats.uniqueEntities).toBe(2);
      expect(stats.eventTypes).toEqual({
        api_call: 1,
        file_upload: 1,
      });
      expect(stats.uptime).toHaveProperty('ms');
      expect(stats.uptime).toHaveProperty('human');
    });
  });
});
