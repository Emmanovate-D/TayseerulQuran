const { sendValidationError } = require('../utils/responseHandler');

/**
 * Validate request using Joi schema
 * @param {Object} schema - Joi validation schema
 * @param {String} source - 'body', 'query', or 'params'
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      return sendValidationError(res, errors);
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

module.exports = {
  validate
};

