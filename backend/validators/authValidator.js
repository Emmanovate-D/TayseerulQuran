const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name must not exceed 100 characters'
    }),
  lastName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Last name is required',
      'string.min': 'Last name must be at least 2 characters',
      'string.max': 'Last name must not exceed 100 characters'
    }),
  email: Joi.string().email().trim().lowercase().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string().min(6).max(255).required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters'
    }),
  phone: Joi.string().trim().pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
  dateOfBirth: Joi.date().max('now').optional(),
  address: Joi.string().trim().max(500).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().trim().lowercase().required()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'Password is required'
    })
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required()
    .messages({
      'string.empty': 'Current password is required'
    }),
  newPassword: Joi.string().min(6).max(255).required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'New password must be at least 6 characters'
    })
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema
};

