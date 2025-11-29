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
      console.log('✅ Main database sync completed');
    } catch (syncError) {
      console.error('⚠️  Database sync warning:', syncError.message);
      // Continue even if sync has issues (tables might already exist)
    }
    
    // Explicitly ensure all tables exist (they might not be created by sync)
    // This runs regardless of whether the main sync succeeded or failed
    console.log('🔄 Ensuring all tables exist...');
    const { UserRole, RolePermission, StudentCourse, BlogPost, Course, Payment, Student, Tutor, Contact } = require('./models');
    
    // Sync junction tables
    try {
      await UserRole.sync({ alter: false });
      console.log('✅ UserRole table verified');
    } catch (err) {
      console.error('⚠️  UserRole sync error:', err.message);
    }
    
    try {
      await RolePermission.sync({ alter: false });
      console.log('✅ RolePermission table verified');
    } catch (err) {
      console.error('⚠️  RolePermission sync error:', err.message);
    }
    
    try {
      await StudentCourse.sync({ alter: false });
      console.log('✅ StudentCourse table verified');
    } catch (err) {
      console.error('⚠️  StudentCourse sync error:', err.message);
    }
    
    // Sync main tables
    console.log('🔄 Syncing main tables (BlogPost, Course, Payment, Student, Tutor, Contact)...');
    
    try {
      await BlogPost.sync({ alter: false });
      console.log('✅ BlogPost table synced');
    } catch (err) {
      console.error('⚠️  BlogPost sync error:', err.message);
      // Try to create table manually if sync fails
      try {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS blog_posts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            content TEXT NOT NULL,
            excerpt VARCHAR(500),
            featuredImage VARCHAR(500),
            authorId INT NOT NULL,
            category VARCHAR(100),
            tags VARCHAR(500),
            views INT DEFAULT 0,
            isPublished BOOLEAN DEFAULT FALSE,
            publishedAt DATETIME,
            isActive BOOLEAN DEFAULT TRUE,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ BlogPost table created manually');
      } catch (createErr) {
        console.error('❌ Failed to create BlogPost table:', createErr.message);
      }
    }
    
    try {
      await Course.sync({ alter: false });
      console.log('✅ Course table synced');
    } catch (err) {
      console.error('⚠️  Course sync error:', err.message);
    }
    
    try {
      await Payment.sync({ alter: false });
      console.log('✅ Payment table synced');
    } catch (err) {
      console.error('⚠️  Payment sync error:', err.message);
    }
    
    try {
      await Student.sync({ alter: false });
      console.log('✅ Student table synced');
    } catch (err) {
      console.error('⚠️  Student sync error:', err.message);
    }
    
    try {
      await Tutor.sync({ alter: false });
      console.log('✅ Tutor table synced');
    } catch (err) {
      console.error('⚠️  Tutor sync error:', err.message);
    }
    
    try {
      await Contact.sync({ alter: false });
      console.log('✅ Contact table synced');
    } catch (err) {
      console.error('⚠️  Contact sync error:', err.message);
    }
    
    console.log('✅ All tables verified');

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

