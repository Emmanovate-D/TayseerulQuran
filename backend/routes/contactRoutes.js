const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const { PERMISSIONS } = require('../utils/constants');

// Public route - anyone can submit contact form
router.post('/', contactController.submitContact);

// Admin routes - require authentication and permissions
router.use(authenticate);
router.get('/', requirePermission(PERMISSIONS.VIEW_STUDENT), contactController.getAllContacts);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_STUDENT), contactController.getContactById);
router.put('/:id', requirePermission(PERMISSIONS.VIEW_STUDENT), contactController.updateContactStatus);
router.delete('/:id', requirePermission(PERMISSIONS.VIEW_STUDENT), contactController.deleteContact);

module.exports = router;

