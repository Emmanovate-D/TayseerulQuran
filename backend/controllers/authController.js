const { User, Role, UserRole, Student } = require('../models');
const { generateToken } = require('../config/jwt');
const { sendSuccess, sendError, sendUnauthorized } = require('../utils/responseHandler');
const { HTTP_STATUS, ROLES } = require('../utils/constants');
const emailService = require('../services/emailService');
const crypto = require('crypto');

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, dateOfBirth, address } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return sendError(res, 'Please provide a valid email address', HTTP_STATUS.BAD_REQUEST);
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists. Please use a different email or try logging in.', HTTP_STATUS.CONFLICT);
    }

    // Create user with normalized email
    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      phone: phone?.trim() || null,
      dateOfBirth,
      address: address?.trim() || null
    });

    // Assign student role by default
    const studentRole = await Role.findOne({ where: { name: ROLES.STUDENT } });
    if (studentRole) {
      await UserRole.create({
        userId: user.id,
        roleId: studentRole.id
      });
      
      // Automatically create Student profile if student role was assigned
      try {
        const existingStudent = await Student.findOne({ where: { userId: user.id } });
        if (!existingStudent) {
          await Student.create({
            userId: user.id,
            enrollmentDate: new Date(),
            isActive: true
          });
        }
      } catch (studentError) {
        console.error('Error creating student profile:', studentError);
        // Don't fail registration if Student creation fails
      }
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24); // 24 hours expiry

    // Save verification token to user
    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email (non-blocking)
    emailService.sendVerificationEmail(user, verificationToken).catch(err => {
      console.error('Error sending verification email:', err);
      // Don't fail registration if email fails
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.emailVerificationToken;

    return sendSuccess(res, {
      user: userResponse,
      token
    }, 'User registered successfully. Please check your email to verify your account.', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return sendError(res, 'Email and password are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Find user with roles and permissions (normalize email)
    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() },
      include: [
        {
          model: Role,
          as: 'roles',
          include: [
            {
              model: require('../models').Permission,
              as: 'permissions',
              through: { attributes: [] }
            }
          ],
          through: { attributes: [] }
        }
      ]
    });

    if (!user) {
      return sendUnauthorized(res, 'Invalid email or password. Please check your credentials and try again.');
    }

    if (!user.isActive) {
      return sendUnauthorized(res, 'Your account has been deactivated. Please contact support for assistance.');
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return sendUnauthorized(res, 'Invalid email or password. Please check your credentials and try again.');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    return sendSuccess(res, {
      user: userResponse,
      token
    }, 'Login successful');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get current user profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [
            {
              model: require('../models').Permission,
              as: 'permissions',
              through: { attributes: [] }
            }
          ],
          through: { attributes: [] }
        }
      ],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    return sendSuccess(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Change password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.userId);

    if (!user) {
      return sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return sendUnauthorized(res, 'Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return sendSuccess(res, null, 'Password changed successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Verify email address
 */
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return sendError(res, 'Verification token is required', HTTP_STATUS.BAD_REQUEST);
    }

    // Find user with matching token
    const user = await User.findOne({
      where: {
        emailVerificationToken: token,
        emailVerificationTokenExpiry: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return sendError(res, 'Invalid or expired verification token', HTTP_STATUS.BAD_REQUEST);
    }

    // Verify email
    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpiry = null;
    await user.save();

    return sendSuccess(res, { user: { id: user.id, email: user.email, isEmailVerified: true } }, 'Email verified successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Resend verification email
 */
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Don't reveal if user exists for security
      return sendSuccess(res, null, 'If an account exists with this email, a verification email has been sent.');
    }

    if (user.isEmailVerified) {
      return sendError(res, 'Email is already verified', HTTP_STATUS.BAD_REQUEST);
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpiry = new Date();
    verificationTokenExpiry.setHours(verificationTokenExpiry.getHours() + 24);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationTokenExpiry = verificationTokenExpiry;
    await user.save();

    // Send verification email
    await emailService.sendVerificationEmail(user, verificationToken);

    return sendSuccess(res, null, 'Verification email sent successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Request password reset
 */
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 'Email is required', HTTP_STATUS.BAD_REQUEST);
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Don't reveal if user exists for security
      return sendSuccess(res, null, 'If an account exists with this email, a password reset link has been sent.');
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    await emailService.sendPasswordResetEmail(user, resetToken);

    return sendSuccess(res, null, 'Password reset email sent successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Reset password
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendError(res, 'Token and new password are required', HTTP_STATUS.BAD_REQUEST);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'Password must be at least 6 characters long', HTTP_STATUS.BAD_REQUEST);
    }

    // Find user with matching token
    const user = await User.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiry: {
          [require('sequelize').Op.gt]: new Date()
        }
      }
    });

    if (!user) {
      return sendError(res, 'Invalid or expired reset token', HTTP_STATUS.BAD_REQUEST);
    }

    // Update password
    user.password = newPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpiry = null;
    await user.save();

    return sendSuccess(res, null, 'Password reset successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword
};

