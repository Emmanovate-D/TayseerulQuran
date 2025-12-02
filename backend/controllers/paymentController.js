const { Payment, User, Course, StudentCourse } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');
const { PaymentGatewayFactory, processPaymentWithIdempotency } = require('../services/paymentGateway');
const env = require('../config/env');
const crypto = require('crypto');

/**
 * Get all payments (with pagination)
 */
const getAllPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const { status, userId, courseId, dateFrom, dateTo } = req.query;

    const where = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (courseId) where.courseId = courseId;
    
    // Date range filtering
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) {
        where.createdAt[Op.gte] = new Date(dateFrom);
      }
      if (dateTo) {
        // Include the entire end date by setting time to end of day
        const endDate = new Date(dateTo);
        endDate.setHours(23, 59, 59, 999);
        where.createdAt[Op.lte] = endDate;
      }
    }

    const { count, rows: payments } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ],
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, {
      payments,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    }, 'Payments retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get payment by ID
 */
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ]
    });

    if (!payment) {
      return sendNotFound(res, 'Payment not found');
    }

    return sendSuccess(res, { payment }, 'Payment retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Create new payment
 */
const createPayment = async (req, res) => {
  try {
    const paymentData = {
      ...req.body,
      userId: req.body.userId || req.userId,
      status: 'pending'
    };

    const payment = await Payment.create(paymentData);

    const paymentWithDetails = await Payment.findByPk(payment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ]
    });

    return sendSuccess(res, { payment: paymentWithDetails }, 'Payment created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Update payment
 */
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return sendNotFound(res, 'Payment not found');
    }

    // Set payment date if status changes to completed
    if (updateData.status === 'completed' && payment.status !== 'completed') {
      updateData.paymentDate = new Date();
    }

    await payment.update(updateData);

    const updatedPayment = await Payment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ]
    });

    return sendSuccess(res, { payment: updatedPayment }, 'Payment updated successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Get user's payment history
 */
const getUserPayments = async (req, res) => {
  try {
    // Use userId from params if provided, otherwise use authenticated user's ID
    const userId = req.params.userId || req.user?.userId || req.userId;
    
    // If accessing own payments, ensure they can only see their own
    const currentUserId = req.user?.userId || req.userId;
    if (req.params.userId && req.params.userId !== currentUserId.toString()) {
      // Check if user has permission to view other users' payments
      const userRoles = req.user.roles.map(role => role.name);
      if (!userRoles.includes('super_admin') && !userRoles.includes('admin')) {
        return sendError(res, 'You can only view your own payments', HTTP_STATUS.FORBIDDEN);
      }
    }

    const payments = await Payment.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price', 'thumbnail']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    return sendSuccess(res, { payments }, 'Payment history retrieved successfully');
  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Process payment through gateway
 */
const processPayment = async (req, res) => {
  try {
    const { courseId, amount, currency, paymentMethod, metadata } = req.body;
    const userId = req.user?.userId || req.userId;

    if (!courseId || !amount || !paymentMethod) {
      return sendError(res, 'Course ID, amount, and payment method are required', HTTP_STATUS.BAD_REQUEST);
    }

    // Get course
    const course = await Course.findByPk(courseId);
    if (!course) {
      return sendNotFound(res, 'Course not found');
    }

    // Validate amount
    if (parseFloat(amount) !== parseFloat(course.price)) {
      return sendError(res, 'Payment amount does not match course price', HTTP_STATUS.BAD_REQUEST);
    }

    // Create payment record first
    const payment = await Payment.create({
      userId,
      courseId,
      amount: parseFloat(amount),
      currency: currency || 'USD',
      paymentMethod,
      status: 'pending',
      metadata: metadata || {}
    });

    // Get gateway configuration from centralized config
    const gatewayType = paymentMethod === 'credit_card' ? 'stripe' : 
                       paymentMethod === 'paypal' ? 'paypal' : 
                       'bank_transfer';
    
    const gatewayConfig = env.getGatewayConfig(gatewayType);

    // Initialize gateway
    const gateway = PaymentGatewayFactory.create(gatewayType, gatewayConfig);

    // Generate idempotency key
    const idempotencyKey = `payment_${payment.id}_${Date.now()}`;

    // Process payment through gateway
    const gatewayResult = await processPaymentWithIdempotency(gateway, {
      amount: parseFloat(amount),
      currency: currency || 'USD',
      paymentMethod,
      metadata: {
        paymentId: payment.id,
        courseId,
        userId,
        ...metadata
      }
    }, idempotencyKey);

    // Update payment with gateway response
    await payment.update({
      transactionId: gatewayResult.transactionId,
      status: gatewayResult.status,
      metadata: {
        ...payment.metadata,
        gateway: gatewayResult.gateway,
        gatewayMetadata: gatewayResult.metadata,
        idempotencyKey
      }
    });

    // If payment is completed, create enrollment
    if (gatewayResult.status === 'completed') {
      await createEnrollmentAfterPayment(payment);
    }

    const updatedPayment = await Payment.findByPk(payment.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price']
        }
      ]
    });

    return sendSuccess(res, {
      payment: updatedPayment,
      redirectUrl: gatewayResult.redirectUrl,
      gateway: gatewayResult.gateway
    }, 'Payment processed successfully', HTTP_STATUS.CREATED);

  } catch (error) {
    console.error('Process payment error:', error);
    return sendError(res, error.message || 'Payment processing failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Handle payment webhook
 */
const handleWebhook = async (req, res) => {
  try {
    const gatewayType = req.params.gateway || req.body.gateway || 'stripe';
    const signature = req.headers['x-signature'] || req.headers['stripe-signature'] || req.headers['paypal-transmission-sig'];
    const payload = JSON.stringify(req.body);

    // Get gateway configuration from centralized config
    const gatewayConfig = env.getGatewayConfig(gatewayType);

    // Initialize gateway
    const gateway = PaymentGatewayFactory.create(gatewayType, gatewayConfig);

    // Verify webhook signature
    const event = await gateway.verifyWebhook(payload, signature);

    // Handle webhook event
    const webhookResult = await gateway.handleWebhook(event);

    if (!webhookResult) {
      return sendSuccess(res, { received: true }, 'Webhook received but no action needed');
    }

    // Find payment by transaction ID
    const payment = await Payment.findOne({
      where: {
        transactionId: webhookResult.transactionId
      }
    });

    if (!payment) {
      console.warn(`Payment not found for transaction: ${webhookResult.transactionId}`);
      return sendSuccess(res, { received: true }, 'Webhook received but payment not found');
    }

    // Update payment status
    const previousStatus = payment.status;
    await payment.update({
      status: webhookResult.status,
      paymentDate: webhookResult.status === 'completed' ? new Date() : payment.paymentDate,
      metadata: {
        ...payment.metadata,
        webhookEvent: event.type || event.event_type,
        webhookReceivedAt: new Date().toISOString()
      }
    });

    // If payment just completed, create enrollment
    if (webhookResult.status === 'completed' && previousStatus !== 'completed') {
      await createEnrollmentAfterPayment(payment);
    }

    return sendSuccess(res, {
      paymentId: payment.id,
      status: webhookResult.status
    }, 'Webhook processed successfully');

  } catch (error) {
    console.error('Webhook error:', error);
    // Still return 200 to prevent gateway from retrying
    return res.status(200).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};

/**
 * Create enrollment after successful payment
 */
async function createEnrollmentAfterPayment(payment) {
  try {
    // Check if enrollment already exists
    const existingEnrollment = await StudentCourse.findOne({
      where: {
        studentId: payment.userId,
        courseId: payment.courseId
      }
    });

    if (existingEnrollment) {
      console.log(`Enrollment already exists for user ${payment.userId} and course ${payment.courseId}`);
      return existingEnrollment;
    }

    // Create enrollment
    const enrollment = await StudentCourse.create({
      studentId: payment.userId,
      courseId: payment.courseId,
      status: 'enrolled',
      enrollmentDate: new Date()
    });

    // Update course enrollment count
    const course = await Course.findByPk(payment.courseId);
    if (course) {
      course.enrollmentCount = (course.enrollmentCount || 0) + 1;
      await course.save();
    }

    return enrollment;
  } catch (error) {
    console.error('Error creating enrollment after payment:', error);
    throw error;
  }
}

/**
 * Get payment receipt
 */
const getReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'price', 'category']
        }
      ]
    });

    if (!payment) {
      return sendNotFound(res, 'Payment not found');
    }

    // Check if user has permission to view this receipt
    if (payment.userId !== userId) {
      const userRoles = req.user.roles?.map(role => role.name) || [];
      if (!userRoles.includes('Super Admin') && !userRoles.includes('Admin')) {
        return sendError(res, 'You do not have permission to view this receipt', HTTP_STATUS.FORBIDDEN);
      }
    }

    // Generate receipt data
    const receipt = {
      paymentId: payment.id,
      transactionId: payment.transactionId,
      date: payment.paymentDate || payment.createdAt,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      user: {
        name: `${payment.user.firstName} ${payment.user.lastName}`,
        email: payment.user.email
      },
      course: {
        title: payment.course.title,
        category: payment.course.category
      }
    };

    return sendSuccess(res, { receipt }, 'Receipt retrieved successfully');

  } catch (error) {
    return sendError(res, error.message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

/**
 * Process refund
 */
const processRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findByPk(id, {
      include: [
        {
          model: Course,
          as: 'course'
        }
      ]
    });

    if (!payment) {
      return sendNotFound(res, 'Payment not found');
    }

    if (payment.status !== 'completed') {
      return sendError(res, 'Only completed payments can be refunded', HTTP_STATUS.BAD_REQUEST);
    }

    const refundAmount = amount ? parseFloat(amount) : parseFloat(payment.amount);

    // Get gateway
    const gatewayType = payment.metadata?.gateway || 'stripe';
    const gatewayConfig = env.getGatewayConfig(gatewayType);

    const gateway = PaymentGatewayFactory.create(gatewayType, gatewayConfig);

    // Process refund
    const refundResult = await gateway.refund(payment.transactionId, refundAmount);

    // Update payment status
    await payment.update({
      status: 'refunded',
      metadata: {
        ...payment.metadata,
        refund: {
          refundId: refundResult.refundId,
          amount: refundAmount,
          reason: reason || 'Customer request',
          refundedAt: new Date().toISOString()
        }
      }
    });

    // Update enrollment status if exists
    const enrollment = await StudentCourse.findOne({
      where: {
        studentId: payment.userId,
        courseId: payment.courseId
      }
    });

    if (enrollment) {
      enrollment.status = 'dropped';
      await enrollment.save();

      // Update course enrollment count
      if (payment.course) {
        payment.course.enrollmentCount = Math.max(0, (payment.course.enrollmentCount || 0) - 1);
        await payment.course.save();
      }
    }

    return sendSuccess(res, {
      payment: await Payment.findByPk(id),
      refund: refundResult
    }, 'Refund processed successfully');

  } catch (error) {
    console.error('Refund error:', error);
    return sendError(res, error.message || 'Refund processing failed', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  getUserPayments,
  processPayment,
  handleWebhook,
  getReceipt,
  processRefund
};

