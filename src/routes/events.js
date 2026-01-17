/**
 * Events Routes
 *
 * POST /v1/events - Record a new usage event
 * GET /v1/events - List events (with filters)
 */

const express = require('express');
const { body, query, validationResult } = require('express-validator');
const usageService = require('../services/usageService');
const { AppError } = require('../middleware/errorHandler');

const router = express.Router();

/**
 * Validation middleware
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((e) => e.msg)
      .join(', ');
    throw new AppError(messages, 400, 'VALIDATION_ERROR');
  }
  next();
};

/**
 * POST /v1/events
 * Record a new usage event
 */
router.post(
  '/',
  [
    body('entityId')
      .notEmpty()
      .withMessage('entityId is required')
      .isString()
      .withMessage('entityId must be a string')
      .trim()
      .isLength({ max: 255 })
      .withMessage('entityId must be 255 characters or less'),
    body('eventType')
      .notEmpty()
      .withMessage('eventType is required')
      .isString()
      .withMessage('eventType must be a string')
      .trim()
      .isLength({ max: 100 })
      .withMessage('eventType must be 100 characters or less'),
    body('metadata').optional().isObject().withMessage('metadata must be an object'),
  ],
  handleValidation,
  (req, res) => {
    const { entityId, eventType, metadata } = req.body;

    const event = usageService.recordEvent({
      entityId,
      eventType,
      metadata,
    });

    res.status(201).json({
      success: true,
      data: event,
    });
  }
);

/**
 * GET /v1/events
 * List events with optional filters
 */
router.get(
  '/',
  [
    query('entityId').optional().isString().trim(),
    query('eventType').optional().isString().trim(),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 1000 })
      .withMessage('limit must be between 1 and 1000')
      .toInt(),
    query('offset').optional().isInt({ min: 0 }).withMessage('offset must be 0 or greater').toInt(),
  ],
  handleValidation,
  (req, res) => {
    const { entityId, eventType, limit, offset } = req.query;

    const result = usageService.getEvents({
      entityId,
      eventType,
      limit: limit || 100,
      offset: offset || 0,
    });

    res.json({
      success: true,
      data: result,
    });
  }
);

module.exports = router;
