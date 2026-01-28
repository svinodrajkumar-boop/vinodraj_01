const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Run all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg,
      value: err.value,
      location: err.location
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', formattedErrors);
  };
};

// Common validation rules
const validationRules = {
  // Employee validations
  createEmployee: [
    body('first_name').notEmpty().withMessage('First name is required').trim(),
    body('last_name').notEmpty().withMessage('Last name is required').trim(),
    body('official_email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone_number').notEmpty().withMessage('Phone number is required'),
    body('joining_date').isDate().withMessage('Valid joining date is required'),
    body('department_id').isUUID().withMessage('Valid department ID is required'),
    body('designation_id').isUUID().withMessage('Valid designation ID is required')
  ],

  updateEmployee: [
    param('id').isUUID().withMessage('Valid employee ID is required'),
    body('official_email').optional().isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone_number').optional().notEmpty().withMessage('Phone number is required'),
    body('date_of_birth').optional().isDate().withMessage('Valid date of birth is required')
  ],

  // Department validations
  createDepartment: [
    body('name').notEmpty().withMessage('Department name is required').trim(),
    body('code').notEmpty().withMessage('Department code is required').trim(),
    body('company_id').isUUID().withMessage('Valid company ID is required')
  ],

  // Designation validations
  createDesignation: [
    body('name').notEmpty().withMessage('Designation name is required').trim(),
    body('code').notEmpty().withMessage('Designation code is required').trim(),
    body('company_id').isUUID().withMessage('Valid company ID is required')
  ],

  // Authentication validations
  login: [
    body('username').notEmpty().withMessage('Username is required').trim(),
    body('password').notEmpty().withMessage('Password is required')
  ],

  register: [
    body('username').notEmpty().withMessage('Username is required').trim().isLength({ min: 3, max: 50 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number')
      .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one special character')
  ],

  // Pagination validations
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('sort').optional().isIn(['asc', 'desc']).withMessage('Sort must be either asc or desc')
  ],

  // UUID parameter validation
  uuidParam: (paramName = 'id') => [
    param(paramName).isUUID().withMessage(`Valid ${paramName} is required`)
  ],

  // File upload validation
  fileUpload: [
    body('file').custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        throw new Error('Invalid file type. Allowed types: JPEG, PNG, PDF');
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }
      
      return true;
    })
  ]
};

module.exports = {
  validateRequest,
  validationRules
};