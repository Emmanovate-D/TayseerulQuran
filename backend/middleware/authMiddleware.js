const { verifyToken } = require('../config/jwt');
const { User, Role, Permission } = require('../models');
const { sendUnauthorized, sendError } = require('../utils/responseHandler');
const { HTTP_STATUS } = require('../utils/constants');

/**
 * Verify JWT token and attach user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendUnauthorized(res, 'No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyToken(token);
    
    // Get user with roles and permissions
    const user = await User.findByPk(decoded.userId, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] }
            }
          ],
          through: { attributes: [] }
        }
      ]
    });

    if (!user || !user.isActive) {
      return sendUnauthorized(res, 'User not found or inactive');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Attach user to request
    req.user = user;
    req.userId = user.id;
    
    next();
  } catch (error) {
    return sendUnauthorized(res, 'Invalid or expired token');
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      
      const user = await User.findByPk(decoded.userId, {
        include: [
          {
            model: Role,
            as: 'roles',
            include: [
              {
                model: Permission,
                as: 'permissions',
                through: { attributes: [] }
              }
            ],
            through: { attributes: [] }
          }
        ]
      });

      if (user && user.isActive) {
        req.user = user;
        req.userId = user.id;
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = {
  authenticate,
  optionalAuth
};

