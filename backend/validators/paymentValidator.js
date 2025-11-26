const Joi = require('joi');

const createPaymentSchema = Joi.object({
  courseId: Joi.number().integer().positive().optional(),
  amount: Joi.number().min(0).precision(2).required()
    .messages({
      'number.min': 'Amount cannot be negative'
    }),
  currency: Joi.string().length(3).uppercase().optional().default('USD'),
  paymentMethod: Joi.string().trim().max(50).optional(),
  description: Joi.string().trim().optional(),
  metadata: Joi.object().optional()
});

const updatePaymentSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'failed', 'refunded').optional(),
  transactionId: Joi.string().trim().max(255).optional(),
  paymentDate: Joi.date().optional(),
  metadata: Joi.object().optional()
});

module.exports = {
  createPaymentSchema,
  updatePaymentSchema
};

