const { DataTypes } = require('sequelize');
const BaseModel = require('./BaseModel');

class Designation extends BaseModel {
  static initModel() {
    const attributes = {
      company_id: {
        type: DataTypes.UUID,
        allowNull: false
      },
      department_id: {
        type: DataTypes.UUID,
        allowNull: true
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
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
          max: 10
        }
      },
      grade: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      min_salary: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      max_salary: {
        type: DataTypes.DECIMAL(12, 2),
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      description: {
        type: DataTypes.TEXT,
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
          fields: ['department_id']
        },
        {
          fields: ['level']
        },
        {
          fields: ['is_active']
        }
      ]
    };

    return this.init(attributes, options);
  }

  static associate(models) {
    // We'll add associations later
  }
}

// Initialize the model
const DesignationModel = Designation.initModel();

module.exports = Designation;