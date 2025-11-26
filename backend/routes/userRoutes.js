const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createUserSchema, updateUserSchema, updateProfileSchema } = require('../validators/userValidator');
const { PERMISSIONS } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

// Get own profile
router.get('/profile', userController.getProfile);

// Update own profile
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

// Admin routes - require permissions
router.get('/', requirePermission(PERMISSIONS.VIEW_USER), userController.getAllUsers);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_USER), userController.getUserById);
router.post('/', requirePermission(PERMISSIONS.CREATE_USER), validate(createUserSchema), userController.createUser);
router.put('/:id', requirePermission(PERMISSIONS.EDIT_USER), validate(updateUserSchema), userController.updateUser);
router.delete('/:id', requirePermission(PERMISSIONS.DELETE_USER), userController.deleteUser);

module.exports = router;

