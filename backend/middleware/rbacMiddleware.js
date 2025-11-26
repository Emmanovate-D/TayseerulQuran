const { sendForbidden, sendUnauthorized } = require('../utils/responseHandler');
const { ROLES } = require('../utils/constants');

/**
 * Check if user has required role(s)
 * @param {...String} allowedRoles - Roles that can access the route
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const userRoles = req.user.roles.map(role => role.name);
    const hasRole = allowedRoles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return sendForbidden(res, 'Insufficient role permissions');
    }

    next();
  };
};

/**
 * Check if user has required permission(s)
 * @param {...String} requiredPermissions - Permissions required to access
 */
const requirePermission = (...requiredPermissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'Authentication required');
    }

    // Super admin has all permissions
    const userRoles = req.user.roles.map(role => role.name);
    if (userRoles.includes(ROLES.SUPER_ADMIN)) {
      return next();
    }

    // Collect all permissions from user's roles
    const userPermissions = new Set();
    req.user.roles.forEach(role => {
      role.permissions.forEach(permission => {
        userPermissions.add(permission.name);
      });
    });

    // Check if user has at least one required permission
    const hasPermission = requiredPermissions.some(permission => 
      userPermissions.has(permission)
    );

    if (!hasPermission) {
      return sendForbidden(res, 'Insufficient permissions');
    }

    next();
  };
};

/**
 * Check if user is super admin
 */
const requireSuperAdmin = requireRole(ROLES.SUPER_ADMIN);

/**
 * Check if user is admin or super admin
 */
const requireAdmin = requireRole(ROLES.SUPER_ADMIN, ROLES.ADMIN);

/**
 * Check if user owns the resource or is admin/super admin
 * @param {Function} getResourceOwnerId - Function to get owner ID from request
 */
const requireOwnershipOrAdmin = (getResourceOwnerId) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendUnauthorized(res, 'Authentication required');
    }

    const userRoles = req.user.roles.map(role => role.name);
    const isAdmin = userRoles.includes(ROLES.SUPER_ADMIN) || userRoles.includes(ROLES.ADMIN);

    if (isAdmin) {
      return next();
    }

    const resourceOwnerId = getResourceOwnerId(req);
    
    if (req.userId === resourceOwnerId) {
      return next();
    }

    return sendForbidden(res, 'You can only access your own resources');
  };
};

module.exports = {
  requireRole,
  requirePermission,
  requireSuperAdmin,
  requireAdmin,
  requireOwnershipOrAdmin
};

