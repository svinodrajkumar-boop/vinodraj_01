const { Department, Company } = require('../models');
const { AppError } = require('../middleware/errorHandler');
const logger = require('../utils/logger');

class DepartmentController {
  // Create a new department
  static async createDepartment(req, res, next) {
    try {
      const { name, code, description, company_id, parent_department_id, head_employee_id } = req.body;

      // Check if department code already exists
      const existingDepartment = await Department.model.findOne({
        where: { code }
      });

      if (existingDepartment) {
        throw new AppError('Department code already exists', 400, 'DUPLICATE_DEPARTMENT_CODE');
      }

      // Create department
      const department = await Department.model.create({
        name,
        code,
        description,
        company_id,
        parent_department_id: parent_department_id || null,
        head_employee_id: head_employee_id || null
      });

      logger.info(`Department created: ${code} by user ${req.user.id}`);

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all departments
  static async getAllDepartments(req, res, next) {
    try {
      const { company_id, include_employees, page = 1, limit = 20 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (company_id) {
        whereClause.company_id = company_id;
      }

      const include = [
        {
          model: Company.model,
          as: 'company',
          attributes: ['id', 'name']
        }
      ];

      if (include_employees === 'true') {
        include.push({
          model: require('../models/Employee').model,
          as: 'employees',
          attributes: ['id', 'employee_id', 'first_name', 'last_name', 'official_email']
        });
      }

      const { count, rows } = await Department.model.findAndCountAll({
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

  // Get department by ID
  static async getDepartmentById(req, res, next) {
    try {
      const { id } = req.params;

      const department = await Department.model.findByPk(id, {
        include: [
          {
            model: Company.model,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Department.model,
            as: 'parent_department',
            attributes: ['id', 'name', 'code']
          },
          {
            model: require('../models/Employee').model,
            as: 'head',
            attributes: ['id', 'employee_id', 'first_name', 'last_name']
          },
          {
            model: require('../models/Employee').model,
            as: 'employees',
            attributes: ['id', 'employee_id', 'first_name', 'last_name', 'official_email', 'designation_id']
          }
        ]
      });

      if (!department) {
        throw new AppError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  // Update department
  static async updateDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const department = await Department.model.findByPk(id);
      if (!department) {
        throw new AppError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
      }

      // Check if new code already exists (if code is being updated)
      if (updateData.code && updateData.code !== department.code) {
        const existingCode = await Department.model.findOne({
          where: { code: updateData.code }
        });

        if (existingCode) {
          throw new AppError('Department code already exists', 400, 'DUPLICATE_DEPARTMENT_CODE');
        }
      }

      await department.update(updateData);

      logger.info(`Department updated: ${id} by user ${req.user.id}`);

      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete department
  static async deleteDepartment(req, res, next) {
    try {
      const { id } = req.params;

      const department = await Department.model.findByPk(id);
      if (!department) {
        throw new AppError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
      }

      // Check if department has employees
      const employeeCount = await require('../models/Employee').model.count({
        where: { department_id: id }
      });

      if (employeeCount > 0) {
        throw new AppError('Cannot delete department with employees', 400, 'DEPARTMENT_HAS_EMPLOYEES');
      }

      await department.destroy();

      logger.info(`Department deleted: ${id} by user ${req.user.id}`);

      res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get department hierarchy
  static async getDepartmentHierarchy(req, res, next) {
    try {
      const { company_id } = req.query;

      const whereClause = {};
      if (company_id) {
        whereClause.company_id = company_id;
      }

      const departments = await Department.model.findAll({
        where: whereClause,
        include: [
          {
            model: Department.model,
            as: 'sub_departments',
            attributes: ['id', 'name', 'code'],
            include: [{
              model: Department.model,
              as: 'sub_departments',
              attributes: ['id', 'name', 'code']
            }]
          }
        ],
        where: {
          parent_department_id: null
        },
        order: [['name', 'ASC']]
      });

      res.status(200).json({
        success: true,
        data: departments
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DepartmentController;