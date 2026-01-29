const { Settings, Company } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

class SettingsController {
  // Get settings for a company
  static async getSettings(req, res, next) {
    try {
      const { company_id } = req.query;
      
      // Use company_id from query or from authenticated user
      const companyId = company_id || req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000';

      let settings = await Settings.model.findOne({
        where: { company_id: companyId },
        include: [
          {
            model: Company.model,
            as: 'company',
            attributes: ['id', 'name']
          }
        ]
      });

      // If settings don't exist, create default settings
      if (!settings) {
        settings = await Settings.model.create({
          company_id: companyId
        });
        
        // Reload with associations
        settings = await Settings.model.findByPk(settings.id, {
          include: [
            {
              model: Company.model,
              as: 'company',
              attributes: ['id', 'name']
            }
          ]
        });
      }

      res.status(200).json({
        success: true,
        data: settings
      });

    } catch (error) {
      next(error);
    }
  }

  // Update settings
  static async updateSettings(req, res, next) {
    try {
      const { company_id, module_settings, dropdown_values, leave_eligibility_days, employee_id_prefix, employee_id_start_number } = req.body;

      const companyId = company_id || req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000';

      let settings = await Settings.model.findOne({
        where: { company_id: companyId }
      });

      if (!settings) {
        // Create new settings
        settings = await Settings.model.create({
          company_id: companyId,
          module_settings,
          dropdown_values,
          leave_eligibility_days,
          employee_id_prefix,
          employee_id_start_number
        });
      } else {
        // Update existing settings
        await settings.update({
          module_settings: module_settings || settings.module_settings,
          dropdown_values: dropdown_values || settings.dropdown_values,
          leave_eligibility_days: leave_eligibility_days !== undefined ? leave_eligibility_days : settings.leave_eligibility_days,
          employee_id_prefix: employee_id_prefix || settings.employee_id_prefix,
          employee_id_start_number: employee_id_start_number || settings.employee_id_start_number
        });
      }

      logger.info(`Settings updated for company: ${companyId} by ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
      });

    } catch (error) {
      next(error);
    }
  }

  // Get dropdown values
  static async getDropdownValues(req, res, next) {
    try {
      const { company_id } = req.query;
      const companyId = company_id || req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000';

      let settings = await Settings.model.findOne({
        where: { company_id: companyId }
      });

      // If settings don't exist, return default values
      if (!settings) {
        settings = await Settings.model.create({
          company_id: companyId
        });
      }

      res.status(200).json({
        success: true,
        data: settings.dropdown_values
      });

    } catch (error) {
      next(error);
    }
  }

  // Get module settings
  static async getModuleSettings(req, res, next) {
    try {
      const { company_id } = req.query;
      const companyId = company_id || req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000';

      let settings = await Settings.model.findOne({
        where: { company_id: companyId }
      });

      // If settings don't exist, return default values
      if (!settings) {
        settings = await Settings.model.create({
          company_id: companyId
        });
      }

      res.status(200).json({
        success: true,
        data: settings.module_settings
      });

    } catch (error) {
      next(error);
    }
  }

  // Update module settings
  static async updateModuleSettings(req, res, next) {
    try {
      const { company_id, module_settings } = req.body;

      if (!module_settings) {
        throw new AppError('Module settings are required', 400, 'MISSING_MODULE_SETTINGS');
      }

      const companyId = company_id || req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000';

      let settings = await Settings.model.findOne({
        where: { company_id: companyId }
      });

      if (!settings) {
        settings = await Settings.model.create({
          company_id: companyId,
          module_settings
        });
      } else {
        await settings.update({ module_settings });
      }

      logger.info(`Module settings updated for company: ${companyId} by ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: 'Module settings updated successfully',
        data: settings.module_settings
      });

    } catch (error) {
      next(error);
    }
  }

  // Update dropdown values
  static async updateDropdownValues(req, res, next) {
    try {
      const { company_id, dropdown_values } = req.body;

      if (!dropdown_values) {
        throw new AppError('Dropdown values are required', 400, 'MISSING_DROPDOWN_VALUES');
      }

      const companyId = company_id || req.user.employee?.company_id || '00000000-0000-0000-0000-000000000000';

      let settings = await Settings.model.findOne({
        where: { company_id: companyId }
      });

      if (!settings) {
        settings = await Settings.model.create({
          company_id: companyId,
          dropdown_values
        });
      } else {
        await settings.update({ dropdown_values });
      }

      logger.info(`Dropdown values updated for company: ${companyId} by ${req.user.username}`);

      res.status(200).json({
        success: true,
        message: 'Dropdown values updated successfully',
        data: settings.dropdown_values
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = SettingsController;
