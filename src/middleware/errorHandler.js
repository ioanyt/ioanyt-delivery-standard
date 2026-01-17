/**
 * Error Handling Middleware
 *
 * Centralized error handling that:
 * - Logs errors with full context
 * - Returns consistent error response format
 * - Hides internal details in production
 */

const logger = require('../utils/logger');
const config = require('../config');

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, _next) => {
  // Default values
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  // Log error with context
  logger.error('Request error', {
    error: err.message,
    code,
    statusCode,
    stack: err.stack,
    traceId: req.traceId,
    method: req.method,
    path: req.path,
  });

  // Build response
  const response = {
    error: {
      code,
      message: err.isOperational ? err.message : 'An unexpected error occurred',
      traceId: req.traceId,
    },
  };

  // Include stack trace in development
  if (config.nodeEnv === 'development') {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

// Handle 404
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Route ${req.method} ${req.path} not found`, 404, 'NOT_FOUND');
  next(err);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};
