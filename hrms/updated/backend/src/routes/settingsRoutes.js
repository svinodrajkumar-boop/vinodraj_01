const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/settingsController');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');
const { rateLimiter } = require('../middleware/rateLimiter');

// Apply rate limiting to all routes
router.use(rateLimiter);

// All settings routes require authentication
router.use(authenticateJWT);

// Get settings (Admin/HR only)
router.get(
  '/',
  authorizeRoles('Admin', 'HR'),
  SettingsController.getSettings
);

// Update settings (Admin only)
router.put(
  '/',
  authorizeRoles('Admin'),
  SettingsController.updateSettings
);

// Get dropdown values (accessible to all authenticated users)
router.get(
  '/dropdowns',
  SettingsController.getDropdownValues
);

// Update dropdown values (Admin only)
router.put(
  '/dropdowns',
  authorizeRoles('Admin'),
  SettingsController.updateDropdownValues
);

// Get module settings (accessible to all authenticated users)
router.get(
  '/modules',
  SettingsController.getModuleSettings
);

// Update module settings (Admin only)
router.put(
  '/modules',
  authorizeRoles('Admin'),
  SettingsController.updateModuleSettings
);

module.exports = router;
