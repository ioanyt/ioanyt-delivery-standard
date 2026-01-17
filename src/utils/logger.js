/**
 * Structured Logger
 *
 * Winston-based logger configured for production use:
 * - JSON format for log aggregation (CloudWatch, ELK, etc.)
 * - Request correlation via trace IDs
 * - Appropriate log levels per environment
 */

const winston = require('winston');
const config = require('../config');

const formats = {
  json: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  simple: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
      return `${timestamp} [${level}]: ${message} ${metaStr}`;
    })
  ),
};

const logger = winston.createLogger({
  level: config.logging.level,
  format: formats[config.logging.format] || formats.json,
  defaultMeta: {
    service: config.app.name,
    version: config.app.version,
  },
  transports: [new winston.transports.Console()],
});

// Add convenience method for request logging
logger.logRequest = (req, res, duration) => {
  logger.info('HTTP Request', {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration,
    traceId: req.traceId,
    userAgent: req.get('user-agent'),
    ip: req.ip,
  });
};

module.exports = logger;
