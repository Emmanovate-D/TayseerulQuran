const Joi = require('joi');

const createCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required()
    .messages({
      'string.empty': 'Course title is required',
      'string.min': 'Title must be at least 3 characters'
    }),
  description: Joi.string().trim().allow('', null).optional(),
  shortDescription: Joi.string().trim().max(500).allow('', null).optional(),
  price: Joi.number().min(0).precision(2).default(0).optional()
    .messages({
      'number.min': 'Price cannot be negative'
    }),
  duration: Joi.number().integer().positive().allow(null).optional(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').allow('', null).optional(),
  category: Joi.string().trim().max(100).allow('', null).optional(),
  thumbnail: Joi.string().uri().allow('', null).optional(),
  tutorId: Joi.number().integer().positive().allow(null).optional(),
  isPublished: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional(),
  description: Joi.string().trim().optional(),
  shortDescription: Joi.string().trim().max(500).optional(),
  price: Joi.number().min(0).precision(2).optional(),
  duration: Joi.number().integer().positive().optional(),
  level: Joi.string().valid('beginner', 'intermediate', 'advanced').optional(),
  category: Joi.string().trim().max(100).optional(),
  thumbnail: Joi.string().uri().optional(),
  tutorId: Joi.number().integer().positive().optional(),
  isPublished: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

module.exports = {
  createCourseSchema,
  updateCourseSchema
};

