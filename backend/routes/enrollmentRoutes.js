const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission, requireRole } = require('../middleware/rbacMiddleware');
const { PERMISSIONS, ROLES } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

// Student routes - own enrollments
router.post('/', requireRole(ROLES.STUDENT), enrollmentController.enrollInCourse);
router.get('/me', requireRole(ROLES.STUDENT), enrollmentController.getMyEnrollments);
router.get('/stats', enrollmentController.getEnrollmentStats);

// Admin routes - all enrollments
router.get('/', requirePermission(PERMISSIONS.VIEW_STUDENT), enrollmentController.getAllEnrollments);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_STUDENT), enrollmentController.getEnrollmentById);
router.put('/:id', requirePermission(PERMISSIONS.ASSIGN_STUDENT), enrollmentController.updateEnrollment);
router.delete('/:id', requirePermission(PERMISSIONS.ASSIGN_STUDENT), enrollmentController.cancelEnrollment);

module.exports = router;

