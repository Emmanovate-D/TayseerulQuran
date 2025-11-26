const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createBlogSchema, updateBlogSchema } = require('../validators/blogValidator');
const { PERMISSIONS } = require('../utils/constants');

// Public routes
router.get('/', optionalAuth, blogController.getAllBlogPosts);
router.get('/:id', optionalAuth, blogController.getBlogPostById);

// Protected routes
router.use(authenticate);

// Admin routes
router.post('/', requirePermission(PERMISSIONS.CREATE_BLOG), validate(createBlogSchema), blogController.createBlogPost);
router.put('/:id', requirePermission(PERMISSIONS.EDIT_BLOG), validate(updateBlogSchema), blogController.updateBlogPost);
router.delete('/:id', requirePermission(PERMISSIONS.DELETE_BLOG), blogController.deleteBlogPost);

module.exports = router;

