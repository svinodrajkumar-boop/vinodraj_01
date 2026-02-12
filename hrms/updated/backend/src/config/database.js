const { Sequelize } = require('sequelize');
const winston = require('winston');
require('dotenv').config();

// Configure logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/database-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/database-combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Database connection configuration
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: (msg) => logger.debug(msg),
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      paranoid: false
    }
  }
);

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    logger.info('? Database connection established successfully');
    return true;
  } catch (error) {
    logger.error('? Unable to connect to the database:', error.message);
    logger.error('Connection details:', {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER
    });
    
    // Retry logic for production
    if (process.env.NODE_ENV === 'production') {
      logger.warn('Retrying database connection in 5 seconds...');
      setTimeout(testConnection, 5000);
    } else {
      process.exit(1);
    }
    return false;
  }
};

// Connection pool monitoring
const monitorPool = () => {
  setInterval(() => {
    const pool = sequelize.connectionManager.pool;
    logger.debug('Database pool status:', {
      size: pool.size,
      available: pool.available,
      pending: pool.pending,
      max: pool.max
    });
  }, 60000);
};

// Initialize database connection
const initializeDatabase = async () => {
  const connected = await testConnection();
  if (connected && process.env.NODE_ENV === 'production') {
    monitorPool();
  }
  return sequelize;
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase,
  Op: Sequelize.Op,
  DataTypes: Sequelize.DataTypes
};