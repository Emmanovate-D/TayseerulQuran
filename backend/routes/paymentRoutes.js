const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/authMiddleware');
const { requirePermission, requireRole } = require('../middleware/rbacMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createPaymentSchema, updatePaymentSchema } = require('../validators/paymentValidator');
const { PERMISSIONS, ROLES } = require('../utils/constants');

// Webhook route - no authentication required (gateways call this)
router.post('/webhook/:gateway?', paymentController.handleWebhook);
router.post('/webhook', paymentController.handleWebhook);

// All other routes require authentication
router.use(authenticate);

// Specific routes first (before parameterized routes)
router.get('/me/payments', requireRole(ROLES.STUDENT), paymentController.getUserPayments);
router.get('/user/:userId', requireRole(ROLES.STUDENT), paymentController.getUserPayments);
router.post('/process', requireRole(ROLES.STUDENT), paymentController.processPayment);

// Admin routes - view all payments
router.get('/', requirePermission(PERMISSIONS.VIEW_PAYMENT), paymentController.getAllPayments);
router.post('/', requirePermission(PERMISSIONS.PROCESS_PAYMENT), validate(createPaymentSchema), paymentController.createPayment);
router.get('/:id', requirePermission(PERMISSIONS.VIEW_PAYMENT), paymentController.getPaymentById);
router.get('/:id/receipt', paymentController.getReceipt);
router.put('/:id', requirePermission(PERMISSIONS.PROCESS_PAYMENT), validate(updatePaymentSchema), paymentController.updatePayment);
router.delete('/:id', requirePermission(PERMISSIONS.PROCESS_PAYMENT), paymentController.deletePayment);
router.post('/:id/refund', requirePermission(PERMISSIONS.PROCESS_PAYMENT), paymentController.processRefund);

module.exports = router;

