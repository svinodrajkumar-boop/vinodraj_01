const logger = require('../utils/logger');
const { ValidationError, DatabaseError, UniqueConstraintError } = require('sequelize');

/**
 * Custom error class for application errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'APP_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;
  error.code = err.code || 'INTERNAL_ERROR';

  // Log error
  logger.error('Error Handler:', {
    message: err.message,
    stack: err.stack,
    code: error.code,
    statusCode: error.statusCode,
    path: req.path,
    method: req.method,
    userId: req.user ? req.user.id : null,
    ip: req.ip
  });

  // Sequelize Validation Error
  if (err instanceof ValidationError) {
    error.statusCode = 400;
    error.code = 'VALIDATION_ERROR';
    error.message = 'Validation failed';
    error.errors = err.errors.map(e => ({
      field: e.path,
      message: e.message,
      type: e.type
    }));
  }

  // Sequelize Unique Constraint Error
  if (err instanceof UniqueConstraintError) {
    error.statusCode = 409;
    error.code = 'DUPLICATE_ENTRY';
    error.message = 'Duplicate entry found';
    error.errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
  }

  // Sequelize Database Error
  if (err instanceof DatabaseError) {
    error.statusCode = 500;
    error.code = 'DATABASE_ERROR';
    error.message = 'Database operation failed';
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error.statusCode = 401;
    error.code = 'INVALID_TOKEN';
    error.message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.code = 'TOKEN_EXPIRED';
    error.message = 'Authentication token has expired';
  }

  // Cast Error (Mongoose/ObjectId)
  if (err.name === 'CastError') {
    error.statusCode = 400;
    error.code = 'INVALID_ID';
    error.message = 'Invalid identifier format';
  }

  // Multer File Upload Error
  if (err.name === 'MulterError') {
    error.statusCode = 400;
    error.code = 'FILE_UPLOAD_ERROR';
    
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        error.message = 'File size too large';
        break;
      case 'LIMIT_FILE_COUNT':
        error.message = 'Too many files';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        error.message = 'Unexpected file field';
        break;
      default:
        error.message = 'File upload error';
    }
  }

  // Development vs Production error response
  const isProduction = process.env.NODE_ENV === 'production';
  
  const errorResponse = {
    success: false,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode
  };

  // Add additional details in development
  if (!isProduction) {
    errorResponse.stack = err.stack;
    
    if (error.errors) {
      errorResponse.errors = error.errors;
    }
    
    if (err.original) {
      errorResponse.originalError = err.original.message;
    }
  }

  // Special handling for 404
  if (error.statusCode === 404) {
    errorResponse.message = error.message || 'Resource not found';
  }

  // Send error response
  res.status(error.statusCode).json(errorResponse);
};

module.exports = errorHandler;
module.exports.AppError = AppError;
