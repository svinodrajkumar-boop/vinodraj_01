const express = require('express');
const { initializeModels } = require('./src/models');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'HRMS',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({
    message: 'HRMS Server is working!',
    endpoints: ['/health', '/test'],
    status: 'ready'
  });
});

async function startServer() {
  try {
    // Initialize models
    await initializeModels();
    console.log('? Database models initialized');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n?? HRMS Server Started`);
      console.log(`?? Port: ${PORT}`);
      console.log(`?? URL: http://localhost:${PORT}`);
      console.log(`? Health: http://localhost:${PORT}/health`);
      console.log(`?? Environment: ${process.env.NODE_ENV}`);
      console.log(`\nPress Ctrl+C to stop\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
