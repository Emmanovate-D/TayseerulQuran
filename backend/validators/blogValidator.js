const Joi = require('joi');

const createBlogSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).required()
    .messages({
      'string.empty': 'Blog title is required',
      'string.min': 'Title must be at least 3 characters'
    }),
  slug: Joi.string().trim().min(3).max(255).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).allow('', null).optional()
    .messages({
      'string.pattern.base': 'Slug must be URL-friendly (lowercase letters, numbers, and hyphens only)'
    }),
  content: Joi.string().trim().min(10).required()
    .messages({
      'string.empty': 'Blog content is required',
      'string.min': 'Content must be at least 10 characters'
    }),
  excerpt: Joi.string().trim().max(500).allow('', null).optional(),
  featuredImage: Joi.string().uri().allow('', null).optional(),
  category: Joi.string().trim().max(100).allow('', null).optional(),
  tags: Joi.string().trim().max(500).allow('', null).optional(),
  isPublished: Joi.boolean().optional()
});

const updateBlogSchema = Joi.object({
  title: Joi.string().trim().min(3).max(255).optional(),
  slug: Joi.string().trim().min(3).max(255).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).allow('', null).optional(),
  content: Joi.string().trim().min(10).optional(),
  excerpt: Joi.string().trim().max(500).allow('', null).optional(),
  featuredImage: Joi.string().uri().allow('', null).optional(),
  category: Joi.string().trim().max(100).allow('', null).optional(),
  tags: Joi.string().trim().max(500).allow('', null).optional(),
  isPublished: Joi.boolean().optional(),
  isActive: Joi.boolean().optional()
});

module.exports = {
  createBlogSchema,
  updateBlogSchema
};

