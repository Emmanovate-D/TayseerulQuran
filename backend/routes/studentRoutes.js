const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission, requireRole } = require('../middleware/rbacMiddleware');
const { PERMISSIONS, ROLES } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

// Admin/Staff routes - view students
router.get('/', requirePermission(PERMISSIONS.VIEW_STUDENT), studentController.getAllStudents);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_STUDENT), studentController.getStudentById);
router.get('/:id/courses', requirePermission(PERMISSIONS.VIEW_STUDENT), studentController.getStudentCourses);

// Admin routes - assign students
router.post('/assign', requirePermission(PERMISSIONS.ASSIGN_STUDENT), studentController.assignStudentToTutor);

// Student can view own courses (needs special handler)
// This will be handled in a separate controller method if needed

module.exports = router;

