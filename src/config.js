/**
 * Application Configuration
 *
 * All configuration is loaded from environment variables with sensible defaults.
 * This ensures 12-factor app compliance and easy deployment across environments.
 */

const config = {
  // Server configuration
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Application metadata
  app: {
    name: 'ioanyt-delivery-standard',
    version: process.env.npm_package_version || '1.0.0',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json', // 'json' or 'simple'
  },

  // Usage tracking configuration
  usage: {
    // Maximum events to keep in memory (for demo purposes)
    maxEvents: parseInt(process.env.MAX_EVENTS, 10) || 10000,
    // Retention period in milliseconds (default: 24 hours)
    retentionMs: parseInt(process.env.RETENTION_MS, 10) || 86400000,
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'OPTIONS'],
  },
};

// Validation
if (config.port < 1 || config.port > 65535) {
  throw new Error('PORT must be between 1 and 65535');
}

module.exports = config;
