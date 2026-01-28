const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('../config/redis');
const environment = require('../config/environment');
const logger = require('../utils/logger');

// Create Redis store for rate limiting
const createRedisStore = () => {
  if (!redis.client) {
    logger.warn('Redis not available, using in-memory rate limiting');
    return null;
  }

  return new RedisStore({
    sendCommand: (...args) => redis.client.call(...args),
    prefix: 'hrms:ratelimit:'
  });
};

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: environment.rateLimit.windowMs,
  max: environment.rateLimit.maxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  },
  handler: (req, res) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(environment.rateLimit.windowMs / 1000)
    });
  },
  store: createRedisStore()
});

// Stricter limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Auth rate limit exceeded for IP: ${req.ip}, Username: ${req.body.username}`);
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.',
      code: 'AUTH_RATE_LIMIT_EXCEEDED',
      retryAfter: 900 // 15 minutes in seconds
    });
  },
  keyGenerator: (req) => {
    // Use username + IP for auth endpoints
    return `${req.body.username || 'unknown'}:${req.ip}`;
  },
  store: createRedisStore()
});

// Special limiter for file uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
  handler: (req, res) => {
    logger.warn(`Upload rate limit exceeded for IP: ${req.ip}, User: ${req.user?.id}`);
    res.status(429).json({
      success: false,
      message: 'Too many file uploads, please try again later.',
      code: 'UPLOAD_RATE_LIMIT_EXCEEDED',
      retryAfter: 3600 // 1 hour in seconds
    });
  },
  store: createRedisStore()
});

// Dynamic rate limiting based on user role
const dynamicRateLimiter = (req, res, next) => {
  const userRole = req.user?.roles?.[0] || 'anonymous';
  
  // Define limits per role
  const roleLimits = {
    Admin: 1000,
    HR: 500,
    Manager: 300,
    Employee: 100,
    anonymous: 50
  };
  
  const limit = roleLimits[userRole] || 100;
  
  const userLimiter = rateLimit({
    windowMs: environment.rateLimit.windowMs,
    max: limit,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      return req.user?.id || req.ip;
    },
    handler: (req, res) => {
      logger.warn(`Role-based rate limit exceeded for User: ${req.user?.id}, Role: ${userRole}`);
      res.status(429).json({
        success: false,
        message: `Rate limit exceeded for ${userRole} role`,
        code: 'ROLE_RATE_LIMIT_EXCEEDED'
      });
    },
    store: createRedisStore()
  });
  
  return userLimiter(req, res, next);
};

// Export middleware
module.exports = {
  rateLimiter: apiLimiter,
  authLimiter,
  uploadLimiter,
  dynamicRateLimiter
};
