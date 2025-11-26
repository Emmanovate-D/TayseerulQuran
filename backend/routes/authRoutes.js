const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators/authValidator');

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.post('/change-password', authenticate, validate(changePasswordSchema), authController.changePassword);

module.exports = router;

