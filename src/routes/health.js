/**
 * Health Check Routes
 *
 * GET /health - Liveness probe (is the service running?)
 * GET /ready - Readiness probe (is the service ready to accept traffic?)
 *
 * These endpoints follow Kubernetes health check conventions
 * and are essential for container orchestration.
 */

const express = require('express');
const config = require('../config');
const usageService = require('../services/usageService');

const router = express.Router();

/**
 * GET /health
 * Liveness probe - Returns 200 if service is running
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: config.app.name,
    version: config.app.version,
  });
});

/**
 * GET /ready
 * Readiness probe - Returns 200 if service is ready to accept traffic
 * Includes basic dependency checks
 */
router.get('/ready', (req, res) => {
  const checks = {
    service: 'ok',
    // Add database/cache checks here in production
    // database: await checkDatabase(),
    // redis: await checkRedis(),
  };

  const allHealthy = Object.values(checks).every((status) => status === 'ok');

  if (!allHealthy) {
    return res.status(503).json({
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      checks,
    });
  }

  res.json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    checks,
  });
});

/**
 * GET /info
 * Service information - Returns service metadata
 * Useful for debugging and service discovery
 */
router.get('/info', (req, res) => {
  const stats = usageService.getStats();

  res.json({
    service: config.app.name,
    version: config.app.version,
    environment: config.nodeEnv,
    uptime: stats.uptime,
    stats: {
      totalEvents: stats.totalEvents,
      eventsLastHour: stats.eventsLastHour,
      uniqueEntities: stats.uniqueEntities,
    },
  });
});

module.exports = router;
