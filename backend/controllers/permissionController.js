const { Permission } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Get all permissions
 */
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll({
      order: [['name', 'ASC']]
    });

    return sendSuccess(res, { permissions }, 'Permissions retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get permission by ID
 */
const getPermissionById = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);

    if (!permission) {
      return sendNotFound(res, 'Permission not found');
    }

    return sendSuccess(res, { permission }, 'Permission retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create new permission
 */
const createPermission = async (req, res) => {
  try {
    const permission = await Permission.create(req.body);

    return sendSuccess(res, { permission }, 'Permission created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update permission
 */
const updatePermission = async (req, res) => {
  try {
    const { id } = req.params;

    const permission = await Permission.findByPk(id);
    if (!permission) {
      return sendNotFound(res, 'Permission not found');
    }

    await permission.update(req.body);

    return sendSuccess(res, { permission }, 'Permission updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission
};

