const { User, Role, UserRole } = require('../models');
const { generateToken } = require('../config/jwt');
const { sendSuccess, sendError, sendUnauthorized } = require('../utils/responseHandler');
const { HTTP_STATUS, ROLES } = require('../utils/constants');

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
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    // Remove password from response
    const userResponse = user.toJSON();
    delete userResponse.password;

    return sendSuccess(res, {
      user: userResponse,
      token
    }, 'User registered successfully', HTTP_STATUS.CREATED);
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

module.exports = {
  register,
  login,
  getProfile,
  changePassword
};

