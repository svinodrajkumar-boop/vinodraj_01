const { Designation, Company, Department } = require('../models');
const logger = require('../utils/logger');

class DesignationController {
  static async createDesignation(req, res, next) {
    try {
      const { name, code, level, grade, min_salary, max_salary, description, company_id, department_id } = req.body;

      const existingDesignation = await Designation.model.findOne({
        where: { code }
      });

      if (existingDesignation) {
        return res.status(400).json({
          success: false,
          message: 'Designation code already exists'
        });
      }

      const designation = await Designation.model.create({
        name,
        code,
        level: level || 1,
        grade: grade || null,
        min_salary: min_salary || 0,
        max_salary: max_salary || 0,
        description: description || null,
        company_id,
        department_id: department_id || null
      });

      logger.info(`Designation created: ${code}`);

      res.status(201).json({
        success: true,
        message: 'Designation created successfully',
        data: designation
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAllDesignations(req, res, next) {
    try {
      const { company_id, department_id, page = 1, limit = 20 } = req.query;
      
      const offset = (page - 1) * limit;
      
      const whereClause = {};
      if (company_id) {
        whereClause.company_id = company_id;
      }
      if (department_id) {
        whereClause.department_id = department_id;
      }

      const include = [
        {
          model: Company.model,
          as: 'company',
          attributes: ['id', 'name']
        },
        {
          model: Department.model,
          as: 'department',
          attributes: ['id', 'name', 'code']
        }
      ];

      const { count, rows } = await Designation.model.findAndCountAll({
        where: whereClause,
        include: include,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['level', 'ASC'], ['name', 'ASC']]
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

  static async getDesignationById(req, res, next) {
    try {
      const { id } = req.params;

      const designation = await Designation.model.findByPk(id, {
        include: [
          {
            model: Company.model,
            as: 'company',
            attributes: ['id', 'name']
          },
          {
            model: Department.model,
            as: 'department',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      res.status(200).json({
        success: true,
        data: designation
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateDesignation(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const designation = await Designation.model.findByPk(id);
      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      if (updateData.code && updateData.code !== designation.code) {
        const existingCode = await Designation.model.findOne({
          where: { code: updateData.code }
        });

        if (existingCode) {
          return res.status(400).json({
            success: false,
            message: 'Designation code already exists'
          });
        }
      }

      await designation.update(updateData);

      logger.info(`Designation updated: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Designation updated successfully',
        data: designation
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDesignation(req, res, next) {
    try {
      const { id } = req.params;

      const designation = await Designation.model.findByPk(id);
      if (!designation) {
        return res.status(404).json({
          success: false,
          message: 'Designation not found'
        });
      }

      await designation.destroy();

      logger.info(`Designation deleted: ${id}`);

      res.status(200).json({
        success: true,
        message: 'Designation deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DesignationController;