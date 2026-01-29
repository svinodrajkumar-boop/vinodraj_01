const jwt = require('jsonwebtoken');
const environment = require('../config/environment');
const logger = require('../utils/logger');
const { User } = require('../models');

/**
 * Middleware to authenticate JWT
 */
const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        code: 'AUTH_001',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, environment.jwt.secret);

    const user = await User.model.findByPk(decoded.userId, {
      include: [
        {
          model: require('../models/Employee').model,
          as: 'employee',
          attributes: [
            'id',
            'employee_id',
            'first_name',
            'last_name',
            'department_id',
            'designation_id',
          ],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.',
        code: 'AUTH_002',
      });
    }

    req.user = {
      id: user.id,
      username: user.username,
      roles: user.roles,
      employee: user.employee
        ? {
            id: user.employee.id,
            name: `${user.employee.first_name} ${user.employee.last_name}`,
          }
        : null,
    };

    next();
  } catch (error) {
    logger.error('JWT Authentication Error:', error);
    return res.status(401).json({ success: false, message: 'Authentication failed.' });
  }
};

/**
 * Middleware to authorize based on roles
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_009',
      });
    }

    const userRoles = req.user.roles || [];
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      logger.warn(
        `Unauthorized access attempt by user ${req.user.id} to ${req.originalUrl}`
      );
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.',
        code: 'AUTH_010',
      });
    }

    next();
  };
};

/**
 * Middleware to authorize either the user itself or admin roles
 */
const authorizeSelfOrAdmin = (paramName = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        code: 'AUTH_011',
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
      code: 'AUTH_012',
    });
  };
};

/**
 * Middleware for MFA verification (if enabled)
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
        code: 'AUTH_013',
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
        code: 'AUTH_014',
      });
    }

    // In production, you would verify the MFA token
    // For now, we'll accept any non-empty token
    if (mfaToken.trim().length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid MFA token.',
        code: 'AUTH_015',
      });
    }

    next();
  } catch (error) {
    logger.error('MFA Verification Error:', error);
    return res.status(500).json({
      success: false,
      message: 'MFA verification failed.',
      code: 'AUTH_016',
    });
  }
};

module.exports = {
  authenticateJWT,
  authorizeRoles, // Ensure this is exported
  authorizeSelfOrAdmin,
  requireMFA,
};