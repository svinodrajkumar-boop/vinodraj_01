const { DataTypes } = require('sequelize');
const BaseModel = require('./BaseModel');

class Settings extends BaseModel {
  static initModel() {
    const attributes = {
      company_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true
      },
      module_settings: {
        type: DataTypes.JSONB,
        defaultValue: {
          employee: {
            fields: {
              languages: { enabled: true, required: false },
              education: { enabled: true, required: false },
              experience: { enabled: true, required: false },
              skills: { enabled: true, required: false },
              gender: { enabled: true, required: true },
              marital_status: { enabled: true, required: false },
              blood_group: { enabled: true, required: false }
            }
          }
        },
        comment: 'Company-specific module and field configurations'
      },
      dropdown_values: {
        type: DataTypes.JSONB,
        defaultValue: {
          gender: ['Male', 'Female', 'Other'],
          marital_status: ['Single', 'Married', 'Divorced', 'Widowed'],
          blood_group: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          employment_type: ['Permanent', 'Contract', 'Intern', 'Trainee', 'Consultant'],
          employment_status: ['Active', 'Inactive', 'Resigned', 'Terminated', 'Probation']
        },
        comment: 'Dropdown options for various fields'
      },
      leave_eligibility_days: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: 'Number of days after joining before employee is eligible for leaves'
      },
      employee_id_prefix: {
        type: DataTypes.STRING(10),
        defaultValue: 'TG',
        comment: 'Prefix for auto-generated employee IDs'
      },
      employee_id_start_number: {
        type: DataTypes.INTEGER,
        defaultValue: 10001,
        comment: 'Starting number for employee ID generation'
      }
    };

    const options = {
      indexes: [
        {
          unique: true,
          fields: ['company_id']
        }
      ]
    };

    return this.init(attributes, options);
  }

  static associate(models) {
    // Association with Company
    this.model.belongsTo(models.Company.model, {
      foreignKey: 'company_id',
      as: 'company'
    });
  }
}

// Initialize the model
const SettingsModel = Settings.initModel();

module.exports = Settings;
