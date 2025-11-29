const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const courseRoutes = require('./courseRoutes');
const studentRoutes = require('./studentRoutes');
const tutorRoutes = require('./tutorRoutes');
const blogRoutes = require('./blogRoutes');
const paymentRoutes = require('./paymentRoutes');
const enrollmentRoutes = require('./enrollmentRoutes');
const adminRoutes = require('./adminRoutes');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/courses', courseRoutes);
router.use('/students', studentRoutes);
router.use('/tutors', tutorRoutes);
router.use('/blog', blogRoutes);
router.use('/payments', paymentRoutes);
router.use('/enrollments', enrollmentRoutes);
router.use('/admin', adminRoutes);

module.exports = router;

