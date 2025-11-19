const jwt = require('jsonwebtoken');
const env = require('./env');

/**
 * Generate JWT token
 * @param {Object} payload - User data to encode
 * @param {String} type - 'access' or 'refresh'
 * @returns {String} JWT token
 */
const generateToken = (payload, type = 'access') => {
  const secret = type === 'refresh' ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
  const expiresIn = type === 'refresh' ? env.JWT_REFRESH_EXPIRE : env.JWT_EXPIRE;
  
  return jwt.sign(payload, secret, {
    expiresIn,
    issuer: 'tayseerulquran-api',
    audience: 'tayseerulquran-client'
  });
};

/**
 * Verify JWT token
 * @param {String} token - JWT token to verify
 * @param {String} type - 'access' or 'refresh'
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token, type = 'access') => {
  const secret = type === 'refresh' ? env.JWT_REFRESH_SECRET : env.JWT_SECRET;
  
  try {
    return jwt.verify(token, secret, {
      issuer: 'tayseerulquran-api',
      audience: 'tayseerulquran-client'
    });
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {String} token - JWT token
 * @returns {Object} Decoded payload
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken
};

