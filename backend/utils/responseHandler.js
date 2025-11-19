const { HTTP_STATUS, MESSAGES } = require('./constants');

/**
 * Send success response
 */
const sendSuccess = (res, data = null, message = MESSAGES.SUCCESS, statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Send error response
 */
const sendError = (res, message = MESSAGES.SERVER_ERROR, statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
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

