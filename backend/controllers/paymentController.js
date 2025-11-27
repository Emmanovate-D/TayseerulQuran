const { Payment, User, Course } = require('../models');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { Op } = require('sequelize');

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
    const userId = req.params.userId || req.userId;
    
    // If accessing own payments, ensure they can only see their own
    if (req.params.userId && req.params.userId !== req.userId.toString()) {
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

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  getUserPayments
};

