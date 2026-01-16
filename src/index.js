/**
 * Application Entry Point
 *
 * Starts the HTTP server with graceful shutdown handling.
 * Graceful shutdown ensures:
 * - No new connections accepted
 * - Existing requests complete
 * - Resources are cleaned up
 */

const app = require('./app');
const config = require('./config');
const logger = require('./utils/logger');
const usageService = require('./services/usageService');

const server = app.listen(config.port, () => {
  logger.info('Server started', {
    port: config.port,
    environment: config.nodeEnv,
    version: config.app.version,
  });
});

// Graceful shutdown handling
const shutdown = (signal) => {
  logger.info(`${signal} received, starting graceful shutdown`);

  server.close((err) => {
    if (err) {
      logger.error('Error during server close', { error: err.message });
      process.exit(1);
    }

    // Cleanup resources
    usageService.shutdown();

    logger.info('Server closed successfully');
    process.exit(0);
  });

  // Force shutdown after 30 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', { error: err.message, stack: err.stack });
  shutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', { reason, promise });
});

module.exports = server;
