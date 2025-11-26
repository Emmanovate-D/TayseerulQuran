const Joi = require('joi');

const updateProfileSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).optional(),
  lastName: Joi.string().trim().min(2).max(100).optional(),
  phone: Joi.string().trim().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional(),
  dateOfBirth: Joi.date().max('now').optional(),
  address: Joi.string().trim().max(500).optional(),
  profileImage: Joi.string().uri().optional()
});

const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).required(),
  lastName: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().email().trim().lowercase().required(),
  password: Joi.string().min(6).max(255).required(),
  phone: Joi.string().trim().optional(),
  roleIds: Joi.array().items(Joi.number().integer().positive()).optional()
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).optional(),
  lastName: Joi.string().trim().min(2).max(100).optional(),
  email: Joi.string().email().trim().lowercase().optional(),
  phone: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  roleIds: Joi.array().items(Joi.number().integer().positive()).optional()
});

module.exports = {
  updateProfileSchema,
  createUserSchema,
  updateUserSchema
};

