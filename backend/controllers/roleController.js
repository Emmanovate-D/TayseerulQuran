const { Role, Permission, RolePermission } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Get all roles
 */
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      where: { isActive: true },
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ],
      order: [['name', 'ASC']]
    });

    return sendSuccess(res, { roles }, 'Roles retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get role by ID
 */
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    if (!role) {
      return sendNotFound(res, 'Role not found');
    }

    return sendSuccess(res, { role }, 'Role retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create new role
 */
const createRole = async (req, res) => {
  try {
    const { name, description, permissionIds } = req.body;

    const role = await Role.create({ name, description });

    // Assign permissions if provided
    if (permissionIds && permissionIds.length > 0) {
      const permissions = await Permission.findAll({ where: { id: permissionIds } });
      await role.setPermissions(permissions);
    }

    const roleWithPermissions = await Role.findByPk(role.id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    return sendSuccess(res, { role: roleWithPermissions }, 'Role created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update role
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissionIds, isActive } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return sendNotFound(res, 'Role not found');
    }

    if (name) role.name = name;
    if (description !== undefined) role.description = description;
    if (typeof isActive === 'boolean') role.isActive = isActive;

    await role.save();

    // Update permissions if provided
    if (permissionIds && Array.isArray(permissionIds)) {
      const permissions = await Permission.findAll({ where: { id: permissionIds } });
      await role.setPermissions(permissions);
    }

    const updatedRole = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    return sendSuccess(res, { role: updatedRole }, 'Role updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Assign permissions to role
 */
const assignPermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissionIds } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return sendNotFound(res, 'Role not found');
    }

    const permissions = await Permission.findAll({ where: { id: permissionIds } });
    await role.setPermissions(permissions);

    const roleWithPermissions = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: 'permissions',
          through: { attributes: [] }
        }
      ]
    });

    return sendSuccess(res, { role: roleWithPermissions }, 'Permissions assigned successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  assignPermissions
};

