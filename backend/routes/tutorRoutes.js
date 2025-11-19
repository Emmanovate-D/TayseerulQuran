const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission, requireRole } = require('../middleware/rbacMiddleware');
const { PERMISSIONS, ROLES } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

// Specific routes first (before parameterized routes)
router.get('/me/students', requireRole(ROLES.TUTOR), tutorController.getTutorStudents);

// Public tutor listing (with permissions)
router.get('/', requirePermission(PERMISSIONS.VIEW_TUTOR), tutorController.getAllTutors);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_TUTOR), tutorController.getTutorById);
router.get('/:id/students', requirePermission(PERMISSIONS.VIEW_TUTOR), tutorController.getTutorStudents);

// Super Admin routes
router.post('/:id/approve', requirePermission(PERMISSIONS.APPROVE_TUTOR), tutorController.approveTutor);

module.exports = router;

