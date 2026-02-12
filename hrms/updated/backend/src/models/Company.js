const { DataTypes } = require('sequelize');
const BaseModel = require('./BaseModel');

class Company extends BaseModel {
  static initModel() {
    const attributes = {
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      legal_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      logo_url: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      state: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      country: {
        type: DataTypes.STRING(100),
        defaultValue: 'India'
      },
      pin_code: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      tax_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      gst_number: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      pan_number: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      tan_number: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      pf_number: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      esic_number: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      contact_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          isEmail: true
        }
      },
      contact_phone: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      financial_year_start: {
        type: DataTypes.DATEONLY,
        defaultValue: '2024-04-01'
      },
      financial_year_end: {
        type: DataTypes.DATEONLY,
        defaultValue: '2025-03-31'
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
          fields: ['pan_number']
        },
        {
          fields: ['is_active']
        }
      ]
    };

    return this.init(attributes, options);
  }

  static associate(models) {
    // Associations will be set up in index.js
    // We'll add them later when all models are ready
  }
}

// Initialize the model
const CompanyModel = Company.initModel();

module.exports = Company;