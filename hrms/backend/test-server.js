const app = require('./src/app');
const { initializeModels } = require('./src/models');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3001;

async function startServer() {
  try {
    // Initialize models
    await initializeModels();
    
    // Start server
    app.listen(PORT, () => {
      logger.info(`?? Test server running on port ${PORT}`);
      console.log(`? Server is running at http://localhost:${PORT}`);
      console.log(`? Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();