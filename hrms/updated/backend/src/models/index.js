const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

// Import all models
const Company = require('./Company');
const Department = require('./Department');
const Designation = require('./Designation');
const Employee = require('./Employee');
const User = require('./User');

// Simple function to initialize models
const initializeModels = async () => {
  try {
    // Test connection
    await sequelize.authenticate();
    logger.info('? Database connection established');

    // Initialize all models
    Company.initModel();
    Department.initModel();
    Designation.initModel();
    Employee.initModel();
    User.initModel();

    // Return both models and sequelize instance
    return {
      Company,
      Department,
      Designation,
      Employee,
      User,
      sequelize  // Make sure sequelize is included
    };
  } catch (error) {
    logger.error('? Error initializing models:', error);
    throw error;
  }
};

// Export initialization function and sequelize separately
module.exports = {
  initializeModels,
  sequelize  // Also export sequelize directly
};