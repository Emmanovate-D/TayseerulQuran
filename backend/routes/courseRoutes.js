const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { requirePermission } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createCourseSchema, updateCourseSchema } = require('../validators/courseValidator');
const { PERMISSIONS } = require('../utils/constants');

// Public routes (optional auth for personalized content)
router.get('/', optionalAuth, courseController.getAllCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);

// Protected routes
router.use(authenticate);

// Admin/Tutor routes
router.post('/', requirePermission(PERMISSIONS.CREATE_COURSE), validate(createCourseSchema), courseController.createCourse);
router.put('/:id', requirePermission(PERMISSIONS.EDIT_COURSE), validate(updateCourseSchema), courseController.updateCourse);
router.delete('/:id', requirePermission(PERMISSIONS.DELETE_COURSE), courseController.deleteCourse);

// Enrollment
router.post('/:courseId/enroll', requirePermission(PERMISSIONS.ASSIGN_STUDENT), courseController.enrollStudent);

module.exports = router;

