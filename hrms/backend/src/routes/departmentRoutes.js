const express = require('express');
const router = express.Router();
const DepartmentController = require('../controllers/departmentController');
const { validateRequest, validationRules } = require('../middleware/validation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// All department routes require authentication
router.use(authenticateJWT);

// Get all departments
router.get('/',
  authorizeRoles('HR', 'Admin', 'Manager'),
  validateRequest(validationRules.pagination),
  DepartmentController.getAllDepartments
);

// Get department by ID
router.get('/:id',
  validateRequest(validationRules.uuidParam('id')),
  DepartmentController.getDepartmentById
);

// Create new department (HR/Admin only)
router.post('/',
  authorizeRoles('HR', 'Admin'),
  validateRequest(validationRules.createDepartment),
  DepartmentController.createDepartment
);

// Update department
router.put('/:id',
  authorizeRoles('HR', 'Admin'),
  validateRequest(validationRules.uuidParam('id')),
  DepartmentController.updateDepartment
);

// Delete department (Admin only)
router.delete('/:id',
  authorizeRoles('Admin'),
  validateRequest(validationRules.uuidParam('id')),
  DepartmentController.deleteDepartment
);

// Get department hierarchy
router.get('/hierarchy/tree',
  authorizeRoles('HR', 'Admin', 'Manager'),
  DepartmentController.getDepartmentHierarchy
);

// Get department employees
router.get('/:id/employees',
  validateRequest(validationRules.uuidParam('id')),
  DepartmentController.getDepartmentEmployees
);

module.exports = router;