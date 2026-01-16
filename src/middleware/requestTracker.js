/**
 * Request Tracking Middleware
 *
 * This middleware does two things:
 * 1. Assigns a unique trace ID to each request for correlation
 * 2. Records every API call as a usage event (self-tracking)
 *
 * The self-tracking feature means this API tracks its own usage,
 * making it a self-demonstrating reference implementation.
 */

const { v4: uuidv4 } = require('uuid');
const usageService = require('../services/usageService');
const logger = require('../utils/logger');

const requestTracker = () => {
  return (req, res, next) => {
    // Assign trace ID (use incoming header or generate new)
    req.traceId = req.get('x-trace-id') || uuidv4();
    res.set('x-trace-id', req.traceId);

    // Record start time
    req.startTime = Date.now();

    // Track response completion
    res.on('finish', () => {
      const duration = Date.now() - req.startTime;

      // Log the request
      logger.logRequest(req, res, duration);

      // Self-track: Record this API call as a usage event
      // Skip health checks to avoid noise
      if (req.path !== '/health' && req.path !== '/ready') {
        usageService.recordEvent({
          entityId: 'api-self',
          eventType: 'api_call',
          metadata: {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration,
            traceId: req.traceId,
          },
        });
      }
    });

    next();
  };
};

module.exports = requestTracker;
