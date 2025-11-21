const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const { testConnection, sequelize } = require('./config/database');
const { logger } = require('./utils/logger');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const routes = require('./routes');
const { seedDatabase } = require('./scripts/seed');

// Initialize Express app
const app = express();

// Middleware
// CORS configuration - allow multiple origins for development
const allowedOrigins = env.CORS_ORIGIN ? 
  (Array.isArray(env.CORS_ORIGIN) ? env.CORS_ORIGIN : env.CORS_ORIGIN.split(',').map(o => o.trim())) :
  [
    'http://localhost:5500',
    'http://localhost:8080',
    'http://127.0.0.1:5500',
    'http://127.0.0.1:8080',
    'http://localhost:3000'
  ];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Always allow Vercel and Render domains
    if (origin.includes('vercel.app') || origin.includes('onrender.com')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      // In development, allow all origins
      if (env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        // In production, log the blocked origin for debugging
        console.log(`⚠️  CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// API Routes
app.use('/api', routes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TayseerulQuran Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected && env.NODE_ENV === 'production') {
      console.error('❌ Database connection failed. Exiting...');
      process.exit(1);
    }

    // Sync database models (create tables if they don't exist)
    // Using { alter: false } to avoid modifying existing tables
    try {
      console.log('🔄 Syncing database models...');
      await sequelize.sync({ alter: false });
      
      // Explicitly ensure junction tables exist (they might not be created by sync)
      const { UserRole, RolePermission, StudentCourse } = require('./models');
      try {
        await UserRole.sync({ alter: false });
        await RolePermission.sync({ alter: false });
        await StudentCourse.sync({ alter: false });
        console.log('✅ Junction tables verified');
      } catch (junctionError) {
        console.error('⚠️  Junction table sync warning:', junctionError.message);
      }
      
      console.log('✅ Database tables synchronized');
    } catch (syncError) {
      console.error('⚠️  Database sync warning:', syncError.message);
      // Continue even if sync has issues (tables might already exist)
    }

    // Seed database with initial data (roles and test users)
    // Only runs if tables are empty or data doesn't exist
    if (dbConnected) {
      await seedDatabase();
    }

    // Start listening
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  if (env.NODE_ENV === 'production') {
    process.exit(1);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Start the server
startServer();

module.exports = app;

