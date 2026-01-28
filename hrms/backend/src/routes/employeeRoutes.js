const express = require('express');
const router = express.Router();
const EmployeeController = require('../controllers/employeeController');
const { validateRequest, validationRules } = require('../middleware/validation');
const { authenticateJWT, authorizeRoles } = require('../middleware/auth');

// All employee routes require authentication
router.use(authenticateJWT);

// Get all employees (HR/Admin only)
router.get('/',
  authorizeRoles('HR', 'Admin', 'Manager'),
  validateRequest(validationRules.pagination),
  EmployeeController.getAllEmployees
);

// Get employee by ID
router.get('/:id',
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.getEmployeeById
);

// Create new employee (HR/Admin only)
router.post('/',
  authorizeRoles('HR', 'Admin'),
  validateRequest(validationRules.createEmployee),
  EmployeeController.createEmployee
);

// Update employee
router.put('/:id',
  authorizeRoles('HR', 'Admin'),
  validateRequest([
    ...validationRules.uuidParam('id'),
    ...validationRules.updateEmployee
  ]),
  EmployeeController.updateEmployee
);

// Delete employee (Admin only)
router.delete('/:id',
  authorizeRoles('Admin'),
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.deleteEmployee
);

// Get employee documents
router.get('/:id/documents',
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.getEmployeeDocuments
);

// Upload document
router.post('/:id/documents',
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.uploadDocument
);

// Get employee attendance
router.get('/:id/attendance',
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.getEmployeeAttendance
);

// Get employee leaves
router.get('/:id/leaves',
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.getEmployeeLeaves
);

// Get employee payroll
router.get('/:id/payroll',
  authorizeRoles('HR', 'Admin', 'Finance'),
  validateRequest(validationRules.uuidParam('id')),
  EmployeeController.getEmployeePayroll
);

// Search employees
router.get('/search/all',
  authorizeRoles('HR', 'Admin', 'Manager'),
  EmployeeController.searchEmployees
);

module.exports = router;