const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission, requireRole } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createPaymentSchema, updatePaymentSchema } = require('../validators/paymentValidator');
const { PERMISSIONS, ROLES } = require('../utils/constants');

// All routes require authentication
router.use(authenticate);

// Specific routes first (before parameterized routes)
router.get('/me/payments', requireRole(ROLES.STUDENT), paymentController.getUserPayments);
router.get('/user/:userId', requireRole(ROLES.STUDENT), paymentController.getUserPayments);

// Admin routes - view all payments
router.get('/', requirePermission(PERMISSIONS.VIEW_PAYMENT), paymentController.getAllPayments);
router.post('/', requirePermission(PERMISSIONS.PROCESS_PAYMENT), validate(createPaymentSchema), paymentController.createPayment);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_PAYMENT), paymentController.getPaymentById);
router.put('/:id', requirePermission(PERMISSIONS.PROCESS_PAYMENT), validate(updatePaymentSchema), paymentController.updatePayment);

module.exports = router;

