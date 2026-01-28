const jwt = require('jsonwebtoken');
const environment = require('../config/environment');
const logger = require('../utils/logger');
const { User } = require('../models');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticateJWT = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'AUTH_001'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, environment.jwt.secret);
    
    // Get user from database
    const user = await User.model.findByPk(decoded.userId, {
      include: [{
        model: require('../models/Employee').model,
        as: 'employee',
        attributes: ['id', 'employee_id', 'first_name', 'last_name', 'department_id', 'designation_id']
      }]
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
        code: 'AUTH_002'
      });
    }
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
        code: 'AUTH_003'
      });
    }
    
    // Check if account is locked
    if (user.isAccountLocked()) {
      return res.status(401).json({
        success: false,
        message: 'Account is locked. Please try again later.',
        code: 'AUTH_004'
      });
    }
    
    // Check if password is expired
    if (user.isPasswordExpired()) {
      return res.status(401).json({
        success: false,
        message: 'Password has expired. Please reset your password.',
        code: 'AUTH_005'
      });
    }
    
    // Update last login time
    if (!req.path.includes('/auth/')) {
      user.last_login_at = new Date();
      await user.save();
    }
    
    // Attach user to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
      employee: user.employee ? {
        id: user.employee.id,
        employeeId: user.employee.employee_id,
        name: `${user.employee.first_name} ${user.employee.last_name}`,
        departmentId: user.employee.department_id,
        designationId: user.employee.designation_id
      } : null
    };
    
    logger.debug(`User ${user.username} authenticated for ${req.method} ${req.originalUrl}`);
    next();
    
  } catch (error) {
    logger.error('JWT Authentication Error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please login again.',
        code: 'AUTH_006'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        code: 'AUTH_007'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication failed.',
      code: 'AUTH_008'
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required role(s)
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_009'
      });
    }
    
    const userRoles = req.user.roles || [];
    
    // Check if user has any of the allowed roles
    const hasRole = allowedRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      logger.warn(`Unauthorized access attempt by user ${req.user.id} to ${req.originalUrl}`);
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        code: 'AUTH_010'
      });
    }
    
    next();
  };
};

/**
 * Check if user is accessing their own data or has admin role
 */
const authorizeSelfOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_011'
      });
    }
    
    const userId = req.params[paramName] || req.body.userId;
    const isSelf = req.user.id === userId;
    const isAdmin = req.user.roles.includes('Admin') || req.user.roles.includes('HR');
    
    if (isSelf || isAdmin) {
      return next();
    }
    
    logger.warn(`Unauthorized data access attempt by user ${req.user.id}`);
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data.',
      code: 'AUTH_012'
    });
  };
};

/**
 * MFA Verification middleware
 * Requires MFA for sensitive operations
 */
const requireMFA = async (req, res, next) => {
  try {
    if (!environment.features.mfaEnabled) {
      return next();
    }
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_013'
      });
    }
    
    const user = await User.model.findByPk(req.user.id);
    
    if (!user.two_factor_enabled) {
      return next();
    }
    
    // Check for MFA token in header
    const mfaToken = req.headers['x-mfa-token'];
    
    if (!mfaToken) {
      return res.status(401).json({
        success: false,
        message: 'MFA verification required.',
        code: 'AUTH_014'
      });
    }
    
    // In production, you would verify the MFA token
    // For now, we'll accept any non-empty token
    if (mfaToken.trim().length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid MFA token.',
        code: 'AUTH_015'
      });
    }
    
    next();
  } catch (error) {
    logger.error('MFA Verification Error:', error);
    return res.status(500).json({
      success: false,
      message: 'MFA verification failed.',
      code: 'AUTH_016'
    });
  }
};

module.exports = {
  authenticateJWT,
  authorizeRoles,
  authorizeSelfOrAdmin,
  requireMFA
};
