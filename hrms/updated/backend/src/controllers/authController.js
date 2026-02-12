const { User, Employee } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const environment = require('../config/environment');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

class AuthController {
  // Login user
  static async login(req, res, next) {
    try {
      const { username, password } = req.body;

      // Find user
      const user = await User.model.findOne({
        where: { username },
        include: [{
          model: Employee.model,
          as: 'employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name', 'official_email']
        }]
      });

      if (!user) {
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      // Check if account is locked
      if (user.is_locked) {
        const lockTime = new Date(user.locked_until);
        if (lockTime > new Date()) {
          throw new AppError('Account is locked. Try again later.', 423, 'ACCOUNT_LOCKED');
        } else {
          // Unlock account if lock time has passed
          user.is_locked = false;
          user.locked_until = null;
          user.failed_login_attempts = 0;
          await user.save();
        }
      }

      // Verify password
      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        // Record failed attempt
        await user.recordFailedLogin();
        throw new AppError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
      }

      // Reset failed attempts on successful login
      await user.resetFailedLogins();

      // Update last login
      user.last_login_at = new Date();
      await user.save();

      // Generate tokens
      const accessToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      // Prepare response
      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        employee: user.employee ? {
          id: user.employee.id,
          employeeId: user.employee.employee_id,
          name: `${user.employee.first_name} ${user.employee.last_name}`,
          email: user.employee.official_email
        } : null,
        twoFactorEnabled: user.two_factor_enabled
      };

      // If MFA is enabled, require OTP verification
      if (user.two_factor_enabled) {
        const otp = user.generateMfaOtp();
        await user.save();

        // In production, send OTP via email/SMS
        logger.info(`MFA OTP for ${user.email}: ${otp}`);

        return res.status(200).json({
          success: true,
          message: 'MFA verification required',
          requiresMFA: true,
          email: user.email,
          token: null
        });
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userData,
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: environment.jwt.expiry
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Register new user (for HR/Admin to create accounts)
  static async register(req, res, next) {
    try {
      const { username, email, password, roles, employee_id } = req.body;

      // Check if user already exists
      const existingUser = await User.model.findOne({
        where: { 
          [User.Op.or]: [{ username }, { email }]
        }
      });

      if (existingUser) {
        throw new AppError('Username or email already exists', 400, 'USER_EXISTS');
      }

      // Create user
      const user = await User.model.create({
        username,
        email,
        password_hash: password, // Will be hashed by model hook
        roles: roles || ['Employee'],
        employee_id: employee_id || null
      });

      logger.info(`New user registered: ${username}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user.toJSON()
      });

    } catch (error) {
      next(error);
    }
  }

  // Get user profile
  static async getProfile(req, res, next) {
    try {
      const user = await User.model.findByPk(req.user.id, {
        include: [{
          model: Employee.model,
          as: 'employee',
          attributes: ['id', 'employee_id', 'first_name', 'last_name', 'department_id', 'designation_id', 'official_email', 'phone_number']
        }]
      });

      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: user.toJSON()
      });

    } catch (error) {
      next(error);
    }
  }

  // Update profile
  static async updateProfile(req, res, next) {
    try {
      const { email, phone_number } = req.body;
      const userId = req.user.id;

      const user = await User.model.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Update user
      if (email) user.email = email;
      await user.save();

      // Update employee if exists
      if (user.employee_id) {
        const employee = await Employee.model.findByPk(user.employee_id);
        if (employee && phone_number) {
          employee.phone_number = phone_number;
          await employee.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user.toJSON()
      });

    } catch (error) {
      next(error);
    }
  }

  // Change password
  static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.model.findByPk(userId);
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Verify current password
      const isValid = await user.verifyPassword(currentPassword);
      if (!isValid) {
        throw new AppError('Current password is incorrect', 400, 'INVALID_PASSWORD');
      }

      // Update password
      user.password_hash = newPassword; // Will be hashed by model hook
      await user.save();

      logger.info(`Password changed for user: ${user.username}`);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Forgot password
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      const user = await User.model.findOne({ where: { email } });
      if (!user) {
        // Don't reveal that user doesn't exist
        return res.status(200).json({
          success: true,
          message: 'If an account exists with this email, a reset link has been sent'
        });
      }

      // Generate reset token
      const resetToken = user.generateResetToken();
      await user.save();

      // In production, send email with reset link
      const resetUrl = `${environment.frontendUrl}/reset-password?token=${resetToken}`;
      logger.info(`Password reset link for ${email}: ${resetUrl}`);

      res.status(200).json({
        success: true,
        message: 'Password reset instructions sent to email',
        // In development, return the token for testing
        ...(environment.nodeEnv !== 'production' && { resetToken })
      });

    } catch (error) {
      next(error);
    }
  }

  // Reset password
  static async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;

      // Hash token to compare with stored hash
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

      const user = await User.model.findOne({
        where: {
          reset_password_token: hashedToken,
          reset_password_expiry: { [User.Op.gt]: new Date() }
        }
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
      }

      // Update password
      user.password_hash = password; // Will be hashed by model hook
      user.reset_password_token = null;
      user.reset_password_expiry = null;
      await user.save();

      logger.info(`Password reset for user: ${user.username}`);

      res.status(200).json({
        success: true,
        message: 'Password reset successful. Please login with new password.'
      });

    } catch (error) {
      next(error);
    }
  }

  // Verify MFA OTP
  static async verifyMFA(req, res, next) {
    try {
      const { email, otp } = req.body;

      const user = await User.model.findOne({ where: { email } });
      if (!user) {
        throw new AppError('User not found', 404, 'USER_NOT_FOUND');
      }

      const isValid = user.verifyMfaOtp(otp);
      if (!isValid) {
        throw new AppError('Invalid OTP', 400, 'INVALID_OTP');
      }

      await user.save();

      // Generate tokens after successful MFA verification
      const accessToken = user.generateAuthToken();
      const refreshToken = user.generateRefreshToken();

      const userData = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles
      };

      res.status(200).json({
        success: true,
        message: 'MFA verification successful',
        data: {
          user: userData,
          tokens: {
            accessToken,
            refreshToken,
            expiresIn: environment.jwt.expiry
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Logout
  static async logout(req, res, next) {
    try {
      // In a stateless JWT system, logout is handled client-side
      // But we can blacklist tokens if needed
      res.status(200).json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;