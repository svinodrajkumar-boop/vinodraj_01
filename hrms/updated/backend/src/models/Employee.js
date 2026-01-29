const { DataTypes } = require('sequelize');
const BaseModel = require('./BaseModel');

class Employee extends BaseModel {
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
      designation_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      
      employee_id: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true
        }
      },
      official_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      personal_email: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          isEmail: true
        }
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      emergency_contact: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true
      },
      marital_status: {
        type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        allowNull: true
      },
      blood_group: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      
      joining_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      confirmation_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      employment_type: {
        type: DataTypes.ENUM('Permanent', 'Contract', 'Intern', 'Trainee', 'Consultant'),
        defaultValue: 'Permanent'
      },
      employee_category: {
        type: DataTypes.ENUM('Level1', 'Level2'),
        defaultValue: 'Level1'
      },
      
      reporting_manager_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      team_lead_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      hr_manager_id: {
        type: DataTypes.UUID,
        allowNull: true
      },
      
      bank_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      account_number: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      ifsc_code: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      account_holder_name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      pan_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true
      },
      aadhaar_number: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: true
      },
      
      uan_number: {
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
      professional_tax_state: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      
      employment_status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Resigned', 'Terminated', 'Probation'),
        defaultValue: 'Active'
      },
      resignation_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      last_working_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      exit_reason: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      
      languages: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      education: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      experience: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      skills: {
        type: DataTypes.JSONB,
        defaultValue: []
      },
      
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true
      }
    };

    const options = {
      indexes: [
        {
          unique: true,
          fields: ['employee_id']
        },
        {
          unique: true,
          fields: ['official_email']
        },
        {
          unique: true,
          fields: ['pan_number']
        },
        {
          unique: true,
          fields: ['aadhaar_number']
        },
        {
          fields: ['company_id']
        },
        {
          fields: ['department_id']
        },
        {
          fields: ['designation_id']
        },
        {
          fields: ['employment_status']
        },
        {
          fields: ['joining_date']
        },
        {
          fields: ['reporting_manager_id']
        },
        {
          fields: ['team_lead_id']
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
const EmployeeModel = Employee.initModel();

module.exports = Employee;