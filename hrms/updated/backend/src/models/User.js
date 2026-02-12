const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const BaseModel = require('./BaseModel');
const environment = require('../config/environment');
const logger = require('../utils/logger');

class User extends BaseModel {
  static initModel() {
    const attributes = {
      employee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: true,
        references: {
          model: 'employees',
          key: 'id'
        }
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [3, 100]
        }
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true
        }
      },
      password_hash: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      roles: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: ['Employee']
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      is_locked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      failed_login_attempts: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      locked_until: {
        type: DataTypes.DATE,
        allowNull: true
      },
      password_changed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      password_expiry_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      last_login_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      two_factor_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      two_factor_secret: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      mfa_otp: {
        type: DataTypes.STRING(6),
        allowNull: true
      },
      mfa_otp_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      },
      reset_password_token: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      reset_password_expiry: {
        type: DataTypes.DATE,
        allowNull: true
      }
    };

    const options = {
      hooks: {
        beforeCreate: async (user) => {
          await User.hashPassword(user);
          user.password_expiry_date = User.calculatePasswordExpiry();
        },
        beforeUpdate: async (user) => {
          if (user.changed('password_hash')) {
            await User.hashPassword(user);
            user.password_changed_at = new Date();
            user.password_expiry_date = User.calculatePasswordExpiry();
          }
        }
      },
      indexes: [
        {
          unique: true,
          fields: ['username']
        },
        {
          unique: true,
          fields: ['email']
        },
        {
          unique: true,
          fields: ['employee_id']
        },
        {
          fields: ['is_active']
        },
        {
          fields: ['roles']
        }
      ]
    };

    return this.init(attributes, options);
  }

  // Static Methods
  static async hashPassword(user) {
    if (user.password_hash) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  }

  static calculatePasswordExpiry() {
    const expiryDays = environment.security.passwordExpiryDays || 90;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + expiryDays);
    return expiryDate;
  }

  static validatePassword(password) {
    const minLength = environment.security.passwordMinLength || 8;
    const errors = [];

    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }

    if (environment.security.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (environment.security.passwordRequireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (environment.security.passwordRequireNumber && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (environment.security.passwordRequireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  }

  // Instance Methods
  async verifyPassword(password) {
    try {
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      logger.error('Password verification error:', error);
      return false;
    }
  }

  generateAuthToken() {
    const payload = {
      userId: this.id,
      employeeId: this.employee_id,
      username: this.username,
      email: this.email,
      roles: this.roles
    };

    return jwt.sign(
      payload,
      environment.jwt.secret,
      { expiresIn: environment.jwt.expiry }
    );
  }

  generateRefreshToken() {
    const payload = {
      userId: this.id,
      tokenType: 'refresh'
    };

    return jwt.sign(
      payload,
      environment.jwt.secret,
      { expiresIn: environment.jwt.refreshExpiry }
    );
  }

  generateMfaOtp() {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date();
    expiry.setSeconds(expiry.getSeconds() + environment.jwt.mfaOtpExpiry);

    this.mfa_otp = otp;
    this.mfa_otp_expiry = expiry;

    return otp;
  }

  verifyMfaOtp(otp) {
    if (!this.mfa_otp || !this.mfa_otp_expiry) {
      return false;
    }

    if (this.mfa_otp !== otp) {
      this.failed_login_attempts += 1;
      return false;
    }

    if (new Date() > this.mfa_otp_expiry) {
      return false;
    }

    // Clear OTP after successful verification
    this.mfa_otp = null;
    this.mfa_otp_expiry = null;
    this.failed_login_attempts = 0;

    return true;
  }

  async recordFailedLogin() {
    this.failed_login_attempts += 1;

    if (this.failed_login_attempts >= environment.security.maxLoginAttempts) {
      this.is_locked = true;
      this.locked_until = new Date(Date.now() + 
        environment.security.accountLockDuration * 60 * 1000);
    }

    return await this.save();
  }

  resetFailedLogins() {
    this.failed_login_attempts = 0;
    this.is_locked = false;
    this.locked_until = null;
    return this.save();
  }

  generateResetToken() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.reset_password_token = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    this.reset_password_expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    return resetToken;
  }

  clearResetToken() {
    this.reset_password_token = null;
    this.reset_password_expiry = null;
    return this.save();
  }

  isPasswordExpired() {
    if (!this.password_expiry_date) {
      return false;
    }
    return new Date() > this.password_expiry_date;
  }

  isAccountLocked() {
    if (!this.is_locked) {
      return false;
    }

    if (this.locked_until && new Date() > this.locked_until) {
      this.is_locked = false;
      this.locked_until = null;
      this.failed_login_attempts = 0;
      this.save();
      return false;
    }

    return true;
  }

  toJSON() {
    const values = super.toJSON();
    
    // Remove sensitive fields
    delete values.password_hash;
    delete values.two_factor_secret;
    delete values.mfa_otp;
    delete values.mfa_otp_expiry;
    delete values.reset_password_token;
    delete values.reset_password_expiry;
    
    return values;
  }

  static associate(models) {
    this.model.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee'
    });
  }
}

// Initialize the model
const UserModel = User.initModel();

module.exports = User;
