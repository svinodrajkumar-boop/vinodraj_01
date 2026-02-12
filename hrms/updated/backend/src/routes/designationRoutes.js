const express = require('express');
const router = express.Router();
const DesignationController = require('../controllers/designationController');
const { validateRequest, validationRules } = require('../middleware/validation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// All designation routes require authentication
router.use(authenticateJWT);

// Get all designations
router.get('/',
  authorizeRoles('HR', 'Admin', 'Manager'),
  validateRequest(validationRules.pagination),
  DesignationController.getAllDesignations
);

// Get designation by ID
router.get('/:id',
  validateRequest(validationRules.uuidParam('id')),
  DesignationController.getDesignationById
);

// Create new designation (HR/Admin only)
router.post('/',
  authorizeRoles('HR', 'Admin'),
  validateRequest(validationRules.createDesignation),
  DesignationController.createDesignation
);

// Update designation
router.put('/:id',
  authorizeRoles('HR', 'Admin'),
  validateRequest(validationRules.uuidParam('id')),
  DesignationController.updateDesignation
);

// Delete designation (Admin only)
router.delete('/:id',
  authorizeRoles('Admin'),
  validateRequest(validationRules.uuidParam('id')),
  DesignationController.deleteDesignation
);

// Get designation employees
router.get('/:id/employees',
  validateRequest(validationRules.uuidParam('id')),
  DesignationController.getDesignationEmployees
);

module.exports = router;