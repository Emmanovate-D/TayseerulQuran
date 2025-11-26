const { User, Role, UserRole } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

/**
 * Get all users (with pagination)
 */
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';

    const where = {};
    if (search) {
      where[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: users } = await User.findAndCountAll({
      where,
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }
      ],
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, {
      users,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Users retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get user by ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id, {
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
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, { user }, 'User retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create new user
 */
const createUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, roleIds } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', HTTP_STATUS.CONFLICT);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone
    });

    // Assign roles if provided
    if (roleIds && roleIds.length > 0) {
      const roles = await Role.findAll({ where: { id: roleIds } });
      await user.setRoles(roles);
    }

    // Get user with roles
    const userWithRoles = await User.findByPk(user.id, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }
      ],
      attributes: { exclude: ['password'] }
    });

    return sendSuccess(res, { user: userWithRoles }, 'User created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update user
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, isActive, roleIds } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (typeof isActive === 'boolean') user.isActive = isActive;

    await user.save();

    // Update roles if provided
    if (roleIds && Array.isArray(roleIds)) {
      const roles = await Role.findAll({ where: { id: roleIds } });
      await user.setRoles(roles);
    }

    // Get updated user with roles
    const updatedUser = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }
      ],
      attributes: { exclude: ['password'] }
    });

    return sendSuccess(res, { user: updatedUser }, 'User updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Delete user
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    await user.destroy();

    return sendSuccess(res, null, 'User deleted successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get own profile
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
      return sendNotFound(res, 'User not found');
    }

    return sendSuccess(res, { user }, 'Profile retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update own profile
 */
const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, dateOfBirth, address, profileImage } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) {
      return sendNotFound(res, 'User not found');
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (address) user.address = address;
    if (profileImage) user.profileImage = profileImage;

    await user.save();

    const userResponse = user.toJSON();
    delete userResponse.password;

    return sendSuccess(res, { user: userResponse }, 'Profile updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getProfile,
  updateProfile
};

