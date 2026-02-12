const Redis = require('ioredis');
const environment = require('./environment');
const logger = require('../utils/logger');

let redisClient = null;

const initializeRedis = async () => {
  try {
    redisClient = new Redis({
      host: environment.redis.host,
      port: environment.redis.port,
      password: environment.redis.password || undefined,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    redisClient.on('connect', () => {
      logger.info('? Redis connected successfully');
    });

    redisClient.on('error', (error) => {
      logger.error('? Redis connection error:', error.message);
    });

    // Test connection
    await redisClient.ping();
    logger.info('? Redis connection test successful');

    return redisClient;
  } catch (error) {
    logger.error('? Failed to connect to Redis:', error.message);
    
    // Return a mock client for development
    if (environment.nodeEnv === 'development') {
      logger.warn('??  Using mock Redis client for development');
      return createMockRedis();
    }
    
    throw error;
  }
};

// Mock Redis for development if Redis is not available
const createMockRedis = () => {
  const mockData = new Map();
  
  return {
    get: async (key) => mockData.get(key),
    set: async (key, value, expiryMode, time) => {
      mockData.set(key, value);
      if (time) {
        setTimeout(() => mockData.delete(key), time * 1000);
      }
      return 'OK';
    },
    del: async (key) => {
      const deleted = mockData.delete(key);
      return deleted ? 1 : 0;
    },
    expire: async (key, seconds) => {
      if (mockData.has(key)) {
        setTimeout(() => mockData.delete(key), seconds * 1000);
        return 1;
      }
      return 0;
    },
    ping: async () => 'PONG',
    quit: async () => {
      mockData.clear();
      return 'OK';
    },
    on: () => {}
  };
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initializeRedis() first.');
  }
  return redisClient;
};

module.exports = {
  initializeRedis,
  getRedisClient,
  client: redisClient
};