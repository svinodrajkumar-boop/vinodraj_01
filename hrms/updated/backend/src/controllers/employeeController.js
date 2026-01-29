const { Employee, Department, Designation, Company, User } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

class EmployeeController {
  // Create new employee
  static async createEmployee(req, res, next) {
    try {
      const {
        first_name, last_name, official_email, phone_number,
        joining_date, department_id, designation_id, employee_id,
        date_of_birth, gender, employment_type, employee_category,
        marital_status, blood_group, personal_email, emergency_contact,
        middle_name, languages, education, experience, skills,
        bank_name, account_number, ifsc_code, account_holder_name,
        pan_number, aadhaar_number, uan_number, pf_number, esic_number,
        professional_tax_state, reporting_manager_id, team_lead_id, hr_manager_id
      } = req.body;

      // Check if employee ID already exists
      if (employee_id) {
        const existingEmployee = await Employee.model.findOne({
          where: { employee_id }
        });
        if (existingEmployee) {
          throw new AppError('Employee ID already exists', 400, 'DUPLICATE_EMPLOYEE_ID');
        }
      }

      // Check if email already exists
      const existingEmail = await Employee.model.findOne({
        where: { official_email }
      });
      if (existingEmail) {
        throw new AppError('Email already exists', 400, 'DUPLICATE_EMAIL');
      }

      // Generate employee ID if not provided
      const generatedEmployeeId = employee_id || await EmployeeController.generateEmployeeId();

      // Create employee
      const employee = await Employee.model.create({
        company_id: req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000', // Default company ID
        department_id,
        designation_id,
        employee_id: generatedEmployeeId,
        first_name,
        middle_name,
        last_name,
        official_email,
        personal_email,
        phone_number,
        emergency_contact,
        joining_date: new Date(joining_date),
        date_of_birth: date_of_birth ? new Date(date_of_birth) : null,
        gender,
        marital_status,
        blood_group,
        employment_type: employment_type || 'Permanent',
        employee_category: employee_category || 'Level1',
        employment_status: 'Active',
        languages: languages || [],
        education: education || [],
        experience: experience || [],
        skills: skills || [],
        bank_name,
        account_number,
        ifsc_code,
        account_holder_name,
        pan_number,
        aadhaar_number,
        uan_number,
        pf_number,
        esic_number,
        professional_tax_state,
        reporting_manager_id,
        team_lead_id,
        hr_manager_id
      });

      logger.info(`Employee created: ${generatedEmployeeId} by ${req.user.username}`);

      res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        data: employee
      });

    } catch (error) {
      next(error);
    }
  }

  // Get all employees
  static async getAllEmployees(req, res, next) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        department_id, 
        designation_id,
        employment_status,
        search 
      } = req.query;
      
      const offset = (page - 1) * limit;
      
      // Build where clause
      const whereClause = {};
      
      if (department_id) whereClause.department_id = department_id;
      if (designation_id) whereClause.designation_id = designation_id;
      if (employment_status) whereClause.employment_status = employment_status;
      
      // Search functionality
      if (search) {
        whereClause[Employee.Op.or] = [
          { first_name: { [Employee.Op.iLike]: `%${search}%` } },
          { last_name: { [Employee.Op.iLike]: `%${search}%` } },
          { employee_id: { [Employee.Op.iLike]: `%${search}%` } },
          { official_email: { [Employee.Op.iLike]: `%${search}%` } }
        ];
      }

      const include = [
        {
          model: Department.model,
          as: 'department',
          attributes: ['id', 'name', 'code']
        },
        {
          model: Designation.model,
          as: 'designation',
          attributes: ['id', 'name', 'code', 'level']
        },
        {
          model: Company.model,
          as: 'company',
          attributes: ['id', 'name']
        }
      ];

      const { count, rows } = await Employee.model.findAndCountAll({
        where: whereClause,
        include: include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Get employee by ID
  static async getEmployeeById(req, res, next) {
    try {
      const { id } = req.params;

      const employee = await Employee.model.findByPk(id, {
        include: [
          {
            model: Department.model,
            as: 'department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Designation.model,
            as: 'designation',
            attributes: ['id', 'name', 'code', 'level', 'min_salary', 'max_salary']
          },
          {
            model: Company.model,
            as: 'company',
            attributes: ['id', 'name', 'address', 'contact_email']
          },
          {
            model: Employee.model,
            as: 'reporting_manager',
            attributes: ['id', 'employee_id', 'first_name', 'last_name']
          },
          {
            model: Employee.model,
            as: 'team_lead',
            attributes: ['id', 'employee_id', 'first_name', 'last_name']
          },
          {
            model: User.model,
            as: 'user',
            attributes: ['id', 'username', 'email', 'roles', 'is_active']
          }
        ]
      });

      if (!employee) {
        throw new AppError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: employee
      });

    } catch (error) {
      next(error);
    }
  }

  // Update employee
  static async updateEmployee(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const employee = await Employee.model.findByPk(id);
      if (!employee) {
        throw new AppError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
      }

      // Check if updating email and it already exists
      if (updateData.official_email && updateData.official_email !== employee.official_email) {
        const existingEmail = await Employee.model.findOne({
          where: { official_email: updateData.official_email }
        });
        if (existingEmail) {
          throw new AppError('Email already exists', 400, 'DUPLICATE_EMAIL');
        }
      }

      // Update employee
      await employee.update(updateData);

      logger.info(`Employee updated: ${id} by ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: 'Employee updated successfully',
        data: employee
      });

    } catch (error) {
      next(error);
    }
  }

  // Delete employee
  static async deleteEmployee(req, res, next) {
    try {
      const { id } = req.params;

      const employee = await Employee.model.findByPk(id);
      if (!employee) {
        throw new AppError('Employee not found', 404, 'EMPLOYEE_NOT_FOUND');
      }

      // Check if employee has user account
      const user = await User.model.findOne({ where: { employee_id: id } });
      if (user) {
        throw new AppError('Cannot delete employee with active user account', 400, 'EMPLOYEE_HAS_USER');
      }

      // Soft delete (update status)
      await employee.update({
        employment_status: 'Inactive',
        last_working_date: new Date()
      });

      logger.info(`Employee marked as inactive: ${id} by ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: 'Employee deactivated successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get employee documents
  static async getEmployeeDocuments(req, res, next) {
    try {
      const { id } = req.params;

      // For now, return empty array
      // Will implement document management later
      res.status(200).json({
        success: true,
        data: [],
        message: 'Document module will be implemented'
      });

    } catch (error) {
      next(error);
    }
  }

  // Upload document
  static async uploadDocument(req, res, next) {
    try {
      const { id } = req.params;

      // For now, return success
      // Will implement file upload later
      res.status(200).json({
        success: true,
        message: 'Document upload will be implemented'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get employee attendance
  static async getEmployeeAttendance(req, res, next) {
    try {
      const { id } = req.params;
      const { month, year } = req.query;

      // For now, return empty array
      // Will implement attendance module later
      res.status(200).json({
        success: true,
        data: [],
        message: 'Attendance module will be implemented'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get employee leaves
  static async getEmployeeLeaves(req, res, next) {
    try {
      const { id } = req.params;

      // For now, return empty array
      // Will implement leave module later
      res.status(200).json({
        success: true,
        data: [],
        message: 'Leave module will be implemented'
      });

    } catch (error) {
      next(error);
    }
  }

  // Get employee payroll
  static async getEmployeePayroll(req, res, next) {
    try {
      const { id } = req.params;

      // For now, return empty array
      // Will implement payroll module later
      res.status(200).json({
        success: true,
        data: [],
        message: 'Payroll module will be implemented'
      });

    } catch (error) {
      next(error);
    }
  }

  // Search employees
  static async searchEmployees(req, res, next) {
    try {
      const { q, field = 'all' } = req.query;

      if (!q) {
        throw new AppError('Search query is required', 400, 'SEARCH_QUERY_REQUIRED');
      }

      let whereClause = {};

      switch (field) {
        case 'name':
          whereClause[Employee.Op.or] = [
            { first_name: { [Employee.Op.iLike]: `%${q}%` } },
            { last_name: { [Employee.Op.iLike]: `%${q}%` } }
          ];
          break;
        case 'email':
          whereClause.official_email = { [Employee.Op.iLike]: `%${q}%` };
          break;
        case 'id':
          whereClause.employee_id = { [Employee.Op.iLike]: `%${q}%` };
          break;
        case 'phone':
          whereClause.phone_number = { [Employee.Op.iLike]: `%${q}%` };
          break;
        default:
          whereClause[Employee.Op.or] = [
            { first_name: { [Employee.Op.iLike]: `%${q}%` } },
            { last_name: { [Employee.Op.iLike]: `%${q}%` } },
            { employee_id: { [Employee.Op.iLike]: `%${q}%` } },
            { official_email: { [Employee.Op.iLike]: `%${q}%` } },
            { phone_number: { [Employee.Op.iLike]: `%${q}%` } }
          ];
      }

      const employees = await Employee.model.findAll({
        where: whereClause,
        limit: 50,
        attributes: ['id', 'employee_id', 'first_name', 'last_name', 'official_email', 'phone_number', 'department_id', 'designation_id'],
        include: [
          {
            model: Department.model,
            as: 'department',
            attributes: ['id', 'name']
          },
          {
            model: Designation.model,
            as: 'designation',
            attributes: ['id', 'name']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: employees,
        count: employees.length
      });

    } catch (error) {
      next(error);
    }
  }

  // Helper: Generate employee ID
  static async generateEmployeeId() {
    const prefix = process.env.EMPLOYEE_ID_PREFIX || 'TG';
    const startNumber = parseInt(process.env.EMPLOYEE_ID_START) || 10001;

    // Find the highest existing employee ID
    const lastEmployee = await Employee.model.findOne({
      where: {
        employee_id: {
          [Employee.Op.regexp]: `^${prefix}[0-9]+$`
        }
      },
      order: [['employee_id', 'DESC']]
    });

    let nextNumber = startNumber;
    if (lastEmployee && lastEmployee.employee_id) {
      const lastNumber = parseInt(lastEmployee.employee_id.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(5, '0')}`;
  }
}

module.exports = EmployeeController;