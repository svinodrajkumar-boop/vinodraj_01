const { DataTypes } = require('sequelize');
const BaseModel = require('./BaseModel');

class Department extends BaseModel {
  static initModel() {
    const attributes = {
      company_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      parent_department_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      head_employee_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    };

    const options = {
      indexes: [
        {
          unique: true,
          fields: ['code']
        },
        {
          fields: ['company_id']
        },
        {
          fields: ['parent_department_id']
        },
        {
          fields: ['is_active']
        }
      ]
    };

    return this.init(attributes, options);
  }

  static associate(models) {
    // We'll add associations later when all models are ready
  }
}

// Initialize the model
const DepartmentModel = Department.initModel();

module.exports = Department;