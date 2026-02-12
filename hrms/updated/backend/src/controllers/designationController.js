const { Designation, Employee } = require('../models');
const logger = require('../utils/logger');

class DesignationController {
  static async getAllDesignations(req, res, next) {
    try {
      const designations = await Designation.model.findAll({
        attributes: ['id', 'name', 'code'],
        order: [['name', 'ASC']],
      });
      res.status(200).json({ success: true, data: designations });
    } catch (error) {
      next(error);
    }
  }

  static async getDesignationById(req, res, next) {
    try {
      const { id } = req.params;
      const designation = await Designation.model.findByPk(id, {
        attributes: ['id', 'name', 'code', 'department_id'],
      });

      if (!designation) {
        return res.status(404).json({ success: false, message: 'Designation not found' });
      }

      res.status(200).json({ success: true, data: designation });
    } catch (error) {
      next(error);
    }
  }

  static async createDesignation(req, res, next) {
    try {
      const { name, code, department_id } = req.body;

      const designation = await Designation.model.create({ name, code, department_id });

      logger.info(`Designation created: ${code}`);
      res.status(201).json({ success: true, data: designation });
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
        return res.status(404).json({ success: false, message: 'Designation not found' });
      }

      await designation.update(updateData);

      logger.info(`Designation updated: ${id}`);
      res.status(200).json({ success: true, data: designation });
    } catch (error) {
      next(error);
    }
  }

  static async deleteDesignation(req, res, next) {
    try {
      const { id } = req.params;

      const designation = await Designation.model.findByPk(id);
      if (!designation) {
        return res.status(404).json({ success: false, message: 'Designation not found' });
      }

      await designation.destroy();

      logger.info(`Designation deleted: ${id}`);
      res.status(200).json({ success: true, message: 'Designation deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async getDesignationEmployees(req, res, next) {
    try {
      const { id } = req.params;
      const employees = await Employee.model.findAll({
        where: { designation_id: id },
        attributes: ['id', 'first_name', 'last_name', 'department_id'],
        include: [
          {
            model: Designation.model,
            as: 'designation',
            attributes: ['name', 'code'],
          },
        ],
      });

      res.status(200).json({
        success: true,
        data: employees,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = DesignationController;