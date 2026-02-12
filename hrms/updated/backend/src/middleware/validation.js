const { body, param, query, validationResult } = require('express-validator');
const { AppError } = require('./errorHandler');

// Validation middleware
const validateRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
      value: err.value,
      location: err.location,
    }));

    throw new AppError('Validation failed', 400, 'VALIDATION_ERROR', formattedErrors);
  };
};

// Validation rules
const validationRules = {
  createDepartment: [
    body('name').notEmpty().withMessage('Department name is required').trim(),
    body('code').notEmpty().withMessage('Department code is required').trim(),
    body('company_id').isUUID().withMessage('Valid company ID is required'),
  ],
  pagination: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  ],
  uuidParam: (paramName = 'id') => [
    param(paramName).isUUID().withMessage(`Valid ${paramName} is required`),
  ],
};

module.exports = {
  validateRequest,
  validationRules,
};