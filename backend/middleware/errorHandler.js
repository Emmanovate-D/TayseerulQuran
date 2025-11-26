const { sendError } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');
const { logError } = require('../utils/logger');
const env = require('../config/env');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = err.message || 'Internal server error';
  let errors = null;

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Please check your input and try again';
    errors = err.errors.map(e => ({
      field: e.path,
      message: e.message || `Invalid value for ${e.path}`
    }));
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'This record already exists';
    errors = err.errors.map(e => ({
      field: e.path,
      message: `The ${e.path} you entered is already in use. Please use a different value.`
    }));
  }

  // Sequelize foreign key constraint errors
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Invalid reference. The related record does not exist.';
  }

  // Sequelize database connection errors
  if (err.name === 'SequelizeConnectionError' || err.name === 'SequelizeConnectionRefusedError') {
    statusCode = HTTP_STATUS.SERVICE_UNAVAILABLE;
    message = 'Database connection error. Please try again later.';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid authentication token. Please log in again.';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Your session has expired. Please log in again.';
  }

  // Joi validation errors
  if (err.isJoi) {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = 'Please check your input and correct the errors below';
    errors = err.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message || `Invalid value for ${detail.path.join('.')}`
    }));
  }

  // Log error in development
  if (env.NODE_ENV === 'development') {
    logError(message, err);
    console.error('Error Stack:', err.stack);
    console.error('Error Details:', {
      name: err.name,
      message: err.message,
      statusCode
    });
  } else {
    // Log error in production (without sensitive details)
    logError(message);
    // Don't expose internal error details in production
    if (statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR) {
      message = 'An internal server error occurred. Please try again later.';
      errors = null;
    }
  }

  // Send error response
  sendError(res, message, statusCode, errors);
};

/**
 * 404 Not Found handler
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = HTTP_STATUS.NOT_FOUND;
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};

