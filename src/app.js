/**
 * Express Application Setup
 *
 * Configures the Express app with:
 * - Security middleware (Helmet)
 * - CORS handling
 * - Request parsing
 * - Compression
 * - Request tracking
 * - API routes
 * - Error handling
 */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config');
const requestTracker = require('./middleware/requestTracker');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route imports
const healthRoutes = require('./routes/health');
const eventsRoutes = require('./routes/events');
const usageRoutes = require('./routes/usage');

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors(config.cors));

// Compression
app.use(compression());

// Request parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (skip in test)
if (config.nodeEnv !== 'test') {
  app.use(morgan('combined'));
}

// Request tracking (trace IDs + self-tracking)
app.use(requestTracker());

// Health check routes (no /v1 prefix)
app.use('/', healthRoutes);

// API routes
app.use('/v1/events', eventsRoutes);
app.use('/v1/usage', usageRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    service: config.app.name,
    version: config.app.version,
    documentation: '/docs',
    health: '/health',
    api: {
      events: '/v1/events',
      usage: '/v1/usage',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
