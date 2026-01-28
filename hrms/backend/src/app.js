const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import configurations
const environment = require('./config/environment');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

// Create Express application
const app = express();

// =======================
// Security Middleware
// =======================

app.use(helmet());
app.use(cors({
  origin: environment.frontendUrl || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// =======================
// Body Parsing Middleware
// =======================

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =======================
// Static Files
// =======================

const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/public', express.static(path.join(__dirname, '../public')));

// =======================
// Logging
// =======================

const logDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

if (environment.nodeEnv === 'production') {
  const accessLogStream = fs.createWriteStream(
    path.join(logDir, 'access.log'),
    { flags: 'a' }
  );
  app.use(morgan('combined', { stream: accessLogStream }));
} else {
  app.use(morgan('dev'));
}

// =======================
// Compression
// =======================

app.use(compression());

// =======================
// Health Check Endpoint
// =======================

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HRMS Backend',
    version: '1.0.0',
    environment: environment.nodeEnv,
    uptime: process.uptime()
  });
});

// =======================
// API Routes
// =======================

// Import and use routes
const routes = require('./routes');
app.use(environment.apiPrefix || '/api/v1', routes);

// =======================
// 404 Handler
// =======================

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// =======================
// Error Handling Middleware
// =======================

app.use(errorHandler);

module.exports = app;