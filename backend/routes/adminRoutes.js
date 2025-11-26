const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const permissionController = require('../controllers/permissionController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireSuperAdmin, requirePermission } = require('../middleware/rbacMiddleware');
const { PERMISSIONS } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

// Role management (Super Admin only)
router.get('/roles', requireSuperAdmin, roleController.getAllRoles);
router.get('/roles/:id', requireSuperAdmin, roleController.getRoleById);
router.post('/roles', requireSuperAdmin, roleController.createRole);
router.put('/roles/:id', requireSuperAdmin, roleController.updateRole);
router.post('/roles/:id/permissions', requireSuperAdmin, roleController.assignPermissions);

// Permission management (Super Admin only)
router.get('/permissions', requireSuperAdmin, permissionController.getAllPermissions);
router.get('/permissions/:id', requireSuperAdmin, permissionController.getPermissionById);
router.post('/permissions', requireSuperAdmin, permissionController.createPermission);
router.put('/permissions/:id', requireSuperAdmin, permissionController.updatePermission);

module.exports = router;

