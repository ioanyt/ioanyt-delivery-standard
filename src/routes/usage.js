/**
 * Usage Routes
 *
 * GET /v1/usage/:entityId - Get usage summary for an entity
 * GET /v1/usage/:entityId/history - Get usage history (time-series)
 * GET /v1/usage/stats - Get overall service statistics
 */

const express = require('express');
const { param, query, validationResult } = require('express-validator');
const usageService = require('../services/usageService');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Validation middleware
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    throw new AppError(messages, 400, 'VALIDATION_ERROR');
  }
  next();
};

/**
 * GET /v1/usage/stats
 * Get overall service statistics
 * Note: This route must come before /:entityId to avoid matching
 */
router.get('/stats', (req, res) => {
  const stats = usageService.getStats();

  res.json({
    success: true,
    data: stats,
  });
});

/**
 * GET /v1/usage/:entityId
 * Get usage summary for a specific entity
 */
router.get(
  '/:entityId',
  [
    param('entityId')
      .notEmpty()
      .withMessage('entityId is required')
      .isString()
      .trim(),
    query('since')
      .optional()
      .isISO8601()
      .withMessage('since must be a valid ISO8601 date'),
    query('until')
      .optional()
      .isISO8601()
      .withMessage('until must be a valid ISO8601 date'),
  ],
  handleValidation,
  (req, res) => {
    const { entityId } = req.params;
    const { since, until } = req.query;

    const summary = usageService.getUsageSummary(entityId, { since, until });

    res.json({
      success: true,
      data: summary,
    });
  }
);

/**
 * GET /v1/usage/:entityId/history
 * Get usage history (time-series data) for an entity
 */
router.get(
  '/:entityId/history',
  [
    param('entityId')
      .notEmpty()
      .withMessage('entityId is required')
      .isString()
      .trim(),
    query('since')
      .optional()
      .isISO8601()
      .withMessage('since must be a valid ISO8601 date'),
    query('until')
      .optional()
      .isISO8601()
      .withMessage('until must be a valid ISO8601 date'),
    query('interval')
      .optional()
      .isIn(['minute', 'hour', 'day'])
      .withMessage('interval must be minute, hour, or day'),
  ],
  handleValidation,
  (req, res) => {
    const { entityId } = req.params;
    const { since, until, interval } = req.query;

    const history = usageService.getUsageHistory(entityId, {
      since,
      until,
      interval,
    });

    res.json({
      success: true,
      data: history,
    });
  }
);

module.exports = router;
