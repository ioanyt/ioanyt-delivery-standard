/**
 * Usage Service
 *
 * Core business logic for usage tracking:
 * - In-memory storage (for demo purposes)
 * - Event recording with timestamps
 * - Aggregation and querying
 *
 * Production note: Replace in-memory storage with
 * DynamoDB, TimescaleDB, or InfluxDB for persistence.
 */

const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const logger = require('../utils/logger');

class UsageService {
  constructor() {
    this.events = [];
    this.startTime = Date.now();

    // Periodic cleanup to respect retention policy
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Every minute
  }

  /**
   * Record a usage event
   * @param {Object} params - Event parameters
   * @param {string} params.entityId - Entity identifier (user, org, api-key, etc.)
   * @param {string} params.eventType - Type of event (api_call, file_upload, etc.)
   * @param {Object} params.metadata - Additional event metadata
   * @returns {Object} Created event
   */
  recordEvent({ entityId, eventType, metadata = {} }) {
    const event = {
      id: uuidv4(),
      entityId,
      eventType,
      metadata,
      timestamp: new Date().toISOString(),
      createdAt: Date.now(),
    };

    this.events.push(event);

    // Enforce max events limit (FIFO)
    while (this.events.length > config.usage.maxEvents) {
      this.events.shift();
    }

    logger.debug('Event recorded', { eventId: event.id, entityId, eventType });

    return event;
  }

  /**
   * Get usage summary for an entity
   * @param {string} entityId - Entity identifier
   * @param {Object} options - Query options
   * @returns {Object} Usage summary
   */
  getUsageSummary(entityId, options = {}) {
    const { since, until } = options;

    let filtered = this.events.filter((e) => e.entityId === entityId);

    if (since) {
      const sinceTime = new Date(since).getTime();
      filtered = filtered.filter((e) => e.createdAt >= sinceTime);
    }

    if (until) {
      const untilTime = new Date(until).getTime();
      filtered = filtered.filter((e) => e.createdAt <= untilTime);
    }

    // Aggregate by event type
    const byType = filtered.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {});

    return {
      entityId,
      totalEvents: filtered.length,
      byEventType: byType,
      period: {
        since: since || new Date(this.startTime).toISOString(),
        until: until || new Date().toISOString(),
      },
    };
  }

  /**
   * Get usage history (time-series data)
   * @param {string} entityId - Entity identifier
   * @param {Object} options - Query options
   * @returns {Object} Usage history
   */
  getUsageHistory(entityId, options = {}) {
    const { since, until, interval = 'hour' } = options;

    let filtered = this.events.filter((e) => e.entityId === entityId);

    if (since) {
      const sinceTime = new Date(since).getTime();
      filtered = filtered.filter((e) => e.createdAt >= sinceTime);
    }

    if (until) {
      const untilTime = new Date(until).getTime();
      filtered = filtered.filter((e) => e.createdAt <= untilTime);
    }

    // Group by time bucket
    const buckets = this.groupByTimeBucket(filtered, interval);

    return {
      entityId,
      interval,
      dataPoints: buckets,
      period: {
        since: since || new Date(this.startTime).toISOString(),
        until: until || new Date().toISOString(),
      },
    };
  }

  /**
   * Get all events (with pagination)
   * @param {Object} options - Query options
   * @returns {Object} Events list with pagination
   */
  getEvents(options = {}) {
    const { entityId, eventType, limit = 100, offset = 0 } = options;

    let filtered = [...this.events];

    if (entityId) {
      filtered = filtered.filter((e) => e.entityId === entityId);
    }

    if (eventType) {
      filtered = filtered.filter((e) => e.eventType === eventType);
    }

    // Sort by timestamp descending (most recent first)
    filtered.sort((a, b) => b.createdAt - a.createdAt);

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      events: paginated,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    };
  }

  /**
   * Get service statistics
   * @returns {Object} Service statistics
   */
  getStats() {
    const now = Date.now();
    const uptimeMs = now - this.startTime;

    // Count events in last hour
    const oneHourAgo = now - 3600000;
    const lastHourEvents = this.events.filter((e) => e.createdAt >= oneHourAgo).length;

    // Unique entities
    const uniqueEntities = new Set(this.events.map((e) => e.entityId)).size;

    // Event types breakdown
    const eventTypes = this.events.reduce((acc, e) => {
      acc[e.eventType] = (acc[e.eventType] || 0) + 1;
      return acc;
    }, {});

    return {
      totalEvents: this.events.length,
      eventsLastHour: lastHourEvents,
      uniqueEntities,
      eventTypes,
      uptime: {
        ms: uptimeMs,
        human: this.formatUptime(uptimeMs),
      },
      startTime: new Date(this.startTime).toISOString(),
    };
  }

  /**
   * Group events by time bucket
   * @private
   */
  groupByTimeBucket(events, interval) {
    const bucketMs = {
      minute: 60000,
      hour: 3600000,
      day: 86400000,
    };

    const ms = bucketMs[interval] || bucketMs.hour;
    const buckets = {};

    events.forEach((event) => {
      const bucketTime = Math.floor(event.createdAt / ms) * ms;
      const key = new Date(bucketTime).toISOString();
      buckets[key] = (buckets[key] || 0) + 1;
    });

    // Convert to array sorted by time
    return Object.entries(buckets)
      .map(([timestamp, count]) => ({ timestamp, count }))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Format uptime for human reading
   * @private
   */
  formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * Cleanup old events based on retention policy
   * @private
   */
  cleanup() {
    const cutoff = Date.now() - config.usage.retentionMs;
    const before = this.events.length;

    this.events = this.events.filter((e) => e.createdAt >= cutoff);

    const removed = before - this.events.length;
    if (removed > 0) {
      logger.info('Cleaned up old events', { removed, remaining: this.events.length });
    }
  }

  /**
   * Stop the cleanup interval (for graceful shutdown)
   */
  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Export singleton instance
module.exports = new UsageService();
