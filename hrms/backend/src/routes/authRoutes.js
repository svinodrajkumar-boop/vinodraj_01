const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { validateRequest, validationRules } = require('../middleware/validation');
const { authenticateJWT } = require('../middleware/auth');

// Public routes
router.post('/login', 
  validateRequest(validationRules.login),
  AuthController.login
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