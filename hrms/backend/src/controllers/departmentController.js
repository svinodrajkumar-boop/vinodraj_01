const { Department, Company } = require('../models');
const logger = require('../utils/logger');

class DepartmentController {
  static async createDepartment(req, res, next) {
    try {
      const { name, code, description, company_id, parent_department_id, head_employee_id } = req.body;

      const existingDepartment = await Department.model.findOne({
        where: { code }
      });

      if (existingDepartment) {
        return res.status(400).json({
          success: false,
          message: 'Department code already exists'
        });
      }

      const department = await Department.model.create({
        name,
        code,
        description,
        company_id,
        parent_department_id: parent_department_id || null,
        head_employee_id: head_employee_id || null
      });

      logger.info(`Department created: ${code}`);

      res.status(201).json({
        success: true,
        message: 'Department created successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

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
          }
        ]
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      res.status(200).json({
        success: true,
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateDepartment(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const department = await Department.model.findByPk(id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      if (updateData.code && updateData.code !== department.code) {
        const existingCode = await Department.model.findOne({
          where: { code: updateData.code }
        });

        if (existingCode) {
          return res.status(400).json({
            success: false,
            message: 'Department code already exists'
          });
        }
      }

      await department.update(updateData);

      logger.info(`Department updated: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Department updated successfully',
        data: department
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDepartment(req, res, next) {
    try {
      const { id } = req.params;

      const department = await Department.model.findByPk(id);
      if (!department) {
        return res.status(404).json({
          success: false,
          message: 'Department not found'
        });
      }

      await department.destroy();

      logger.info(`Department deleted: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Department deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DepartmentController;