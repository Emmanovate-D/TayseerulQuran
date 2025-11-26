const { HTTP_STATUS, MESSAGES } = require('./constants');

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Object|Array|null} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code
 */
const sendSuccess = (res, data = null, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message: message || MESSAGES.SUCCESS,
    data
  });
};

/**
 * Send error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {Array|Object} errors - Optional validation errors or error details
 */
const sendError = (res, message = MESSAGES.SERVER_ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message: message || MESSAGES.SERVER_ERROR,
    ...(errors && { errors })
  };
  
  return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
const sendValidationError = (res, errors) => {
  return sendError(res, MESSAGES.VALIDATION_ERROR, HTTP_STATUS.BAD_REQUEST, errors);
};

/**
 * Send unauthorized response
 */
const sendUnauthorized = (res, message = MESSAGES.UNAUTHORIZED) => {
  return sendError(res, message, HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Send forbidden response
 */
const sendForbidden = (res, message = MESSAGES.FORBIDDEN) => {
  return sendError(res, message, HTTP_STATUS.FORBIDDEN);
};

/**
 * Send not found response
 */
const sendNotFound = (res, message = MESSAGES.NOT_FOUND) => {
  return sendError(res, message, HTTP_STATUS.NOT_FOUND);
};

module.exports = {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound
};

