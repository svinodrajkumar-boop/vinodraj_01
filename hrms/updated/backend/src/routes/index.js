const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./authRoutes');
const employeeRoutes = require('./employeeRoutes');
const departmentRoutes = require('./departmentRoutes');
const designationRoutes = require('./designationRoutes');
const settingsRoutes = require('./settingsRoutes');

// Use routes
router.use('/auth', authRoutes);
router.use('/employees', employeeRoutes);
router.use('/departments', departmentRoutes);
router.use('/designations', designationRoutes);
router.use('/settings', settingsRoutes);

// Default route
router.get('/', (req, res) => {
  res.json({
    message: 'HRMS API v1',
    endpoints: {
      auth: '/auth',
      employees: '/employees',
      departments: '/departments',
      designations: '/designations',
      settings: '/settings'
    },
    status: 'active'
  });
});

module.exports = router;