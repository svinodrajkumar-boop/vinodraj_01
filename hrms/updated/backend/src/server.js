const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Import configurations
const environment = require('./config/environment');
const { initializeDatabase } = require('./config/database');
const logger = require('./utils/logger');

// Import app
const app = require('./app');

// Initialize server
let server;

const startServer = async () => {
try {
// Initialize database connection
logger.info('Initializing database connection...');
await initializeDatabase();
logger.info('? Database connection established');

// Start server based on environment
if (environment.nodeEnv === 'production' && environment.ssl.enabled) {
  // HTTPS in production
  const sslOptions = {
    key: fs.readFileSync(environment.ssl.keyPath),
    cert: fs.readFileSync(environment.ssl.certPath)
  };
  server = https.createServer(sslOptions, app);
  logger.info('?? HTTPS server configured');
} else {
  // HTTP for development
  server = http.createServer(app);
}

// Start listening
server.listen(environment.port, () => {
  logger.info(`?? HRMS Backend Server Started`);
  logger.info(`?? Environment: ${environment.nodeEnv}`);
  logger.info(`?? Server URL: ${environment.appUrl}`);
  logger.info(`?? Port: ${environment.port}`);
  logger.info(`?? API Base: ${environment.apiPrefix}`);
  
  if (environment.nodeEnv !== 'production') {
    logger.info(`?? API Docs: ${environment.appUrl}/api-docs`);
  }
  
  logger.info(`?? Server Time: ${new Date().toISOString()}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    logger.error(`Port ${environment.port} is already in use`);
    process.exit(1);
  } else {
    logger.error('Server error:', error);
    throw error;
  }
});

// Handle graceful shutdown
const shutdown = async () => {
  logger.info('Received shutdown signal, closing server...');
  
  try {
    // Close server
    await new Promise((resolve) => {
      server.close(resolve);
    });
    
    logger.info('Server closed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle shutdown signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
} catch (error) {
logger.error('Failed to start server:', error);
process.exit(1);
}
};

// Start the server
startServer();

module.exports = server;