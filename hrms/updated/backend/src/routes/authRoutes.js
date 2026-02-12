const { body } = require('express-validator'); // Ensure this imports 'body' from express-validator
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRequest, validationRules } = require('../middleware/validation'); // Ensure validation middleware is correct
const { authenticateJWT } = require('../middleware/auth'); // Ensure JWT middleware is correct

// Public routes
router.post(
  '/login',
  validateRequest([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  AuthController.login // Ensure 'AuthController' is correctly imported and has the 'login' method
);

router.post('/register', 
  validateRequest(validationRules.register),
  AuthController.register
);

router.post('/forgot-password',
  validateRequest([body('email').isEmail().withMessage('Valid email is required')]),
  AuthController.forgotPassword
);

router.post('/reset-password',
  validateRequest([
    body('token').notEmpty().withMessage('Token is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ]),
  AuthController.resetPassword
);

router.post('/mfa/verify',
  validateRequest([
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
  ]),
  AuthController.verifyMFA
);

// Protected routes
router.get('/profile', 
  authenticateJWT,
  AuthController.getProfile
);

router.put('/profile',
  authenticateJWT,
  AuthController.updateProfile
);

router.post('/change-password',
  authenticateJWT,
  validateRequest([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
  ]),
  AuthController.changePassword
);

router.post('/logout',
  authenticateJWT,
  AuthController.logout
);

module.exports = router;