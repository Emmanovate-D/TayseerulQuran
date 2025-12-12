const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./config/env');

// Wrap all requires in try-catch to prevent crashes
let testConnection, sequelize, logger, errorHandler, notFoundHandler, seedDatabase;

try {
  const dbConfig = require('./config/database');
  testConnection = dbConfig.testConnection;
  sequelize = dbConfig.sequelize;
} catch (err) {
  console.error('⚠️  Database config error:', err.message);
}

try {
  logger = require('./utils/logger').logger;
} catch (err) {
  console.error('⚠️  Logger error:', err.message);
  logger = (req, res, next) => next(); // Fallback logger
}

try {
  const errorHandlers = require('./middleware/errorHandler');
  errorHandler = errorHandlers.errorHandler;
  notFoundHandler = errorHandlers.notFoundHandler;
} catch (err) {
  console.error('⚠️  Error handler error:', err.message);
  // Fallback error handler
  errorHandler = (err, req, res, next) => {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || 'Internal server error'
    });
  };
  notFoundHandler = (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`);
    error.status = 404;
    next(error);
  };
}

// Don't load routes at startup - load them lazily on first request
// This prevents Passenger timeout by avoiding synchronous module loading
// that triggers controllers → models → database access chain
let routes = null;
const loadRoutes = () => {
  if (!routes) {
    try {
      routes = require('./routes');
      console.log('✅ Routes loaded on first request');
    } catch (err) {
      console.error('⚠️  Routes error:', err.message);
      routes = express.Router(); // Fallback empty router
    }
  }
  return routes;
};

try {
  seedDatabase = require('./scripts/seed').seedDatabase;
} catch (err) {
  console.error('⚠️  Seed error:', err.message);
  seedDatabase = async () => {}; // Fallback empty function
}

// Initialize Express app
const app = express();

// Create public/tmp directory if it doesn't exist (for Passenger error files)
// This prevents "directory not found" errors when Passenger tries to write error files
const fs = require('fs');
const publicTmpPath = path.join(__dirname, 'public', 'tmp');
try {
  if (!fs.existsSync(publicTmpPath)) {
    fs.mkdirSync(publicTmpPath, { recursive: true });
    console.log('✅ Created public/tmp directory for Passenger error files');
  }
} catch (dirError) {
  console.error('⚠️  Could not create public/tmp directory:', dirError.message);
  // Non-critical - continue anyway
}

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
    
    // Always allow production domain (tayseerulquran.org)
    if (origin.includes('tayseerulquran.org')) {
      return callback(null, true);
    }
    
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

// Async error wrapper - catches async errors in route handlers
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Lazy database initialization - only runs on first API request
// This prevents Passenger timeout by not blocking app startup
let dbInitialized = false;
let dbInitInProgress = false;

const lazyDbInit = async (req, res, next) => {
  // If already initialized, continue immediately
  if (dbInitialized) {
    return next();
  }
  
  // If initialization is in progress, continue without waiting
  // This prevents multiple simultaneous initializations
  if (dbInitInProgress) {
    return next();
  }
  
  // Check if database config is available
  if (!testConnection || !sequelize || typeof testConnection !== 'function') {
    console.error('⚠️  Database config not available. Skipping initialization.');
    return next(); // Continue anyway - app can work without DB for health checks
  }
  
  // Start initialization in background (don't block request)
  dbInitInProgress = true;
  setImmediate(async () => {
    try {
      console.log('🔄 Lazy database initialization started...');
      
      // Test database connection with timeout
      const connectionPromise = testConnection();
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => resolve(false), 5000);
      });
      
      const dbConnected = await Promise.race([connectionPromise, timeoutPromise]);
      
      if (dbConnected && sequelize) {
        // Sync database models (create tables if they don't exist)
        try {
          await sequelize.sync({ alter: false });
          console.log('✅ Database sync completed');
        } catch (syncError) {
          console.error('⚠️  Database sync warning:', syncError.message);
        }
        
        // Seed database with initial data (only if needed)
        if (seedDatabase && typeof seedDatabase === 'function') {
          try {
            await seedDatabase();
          } catch (seedError) {
            console.error('⚠️  Database seed warning:', seedError.message);
          }
        }
        
        dbInitialized = true;
        console.log('✅ Database initialization completed');
      } else {
        console.error('⚠️  Database connection failed or timed out. Will retry on next request.');
        console.error('⚠️  Check if Railway database service is online.');
      }
    } catch (error) {
      console.error('❌ Database initialization error:', error.message);
    } finally {
      dbInitInProgress = false;
    }
  });
  
  // Continue with request immediately (don't wait for DB init)
  // This allows the app to respond even if database is offline
  next();
};

// Health check endpoint (for API testing) - works even if routes aren't loaded
// Define BEFORE /api route to ensure it's accessible immediately
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    database: dbInitialized ? 'connected' : 'pending',
    routes: routes ? 'loaded' : 'pending'
  });
});

// Manual database sync endpoint (for initial setup - creates all missing tables)
app.get('/api/admin/sync-db', async (req, res) => {
  try {
    if (!sequelize) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    console.log('🔄 Manual database sync triggered...');
    
    // Ensure database connection
    try {
      await testConnection();
      console.log('✅ Database connection verified');
    } catch (connError) {
      console.error('❌ Database connection failed:', connError.message);
      return res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: connError.message
      });
    }
    
    // Import all models to ensure they're loaded and registered
    const models = require('./models');
    console.log('✅ All models loaded');
    
    // Drop problematic junction tables completely - they'll be recreated
    const problematicTables = ['role_permissions', 'user_roles'];
    for (const tableName of problematicTables) {
      try {
        await sequelize.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
        console.log(`✅ Dropped table: ${tableName} (will be recreated)`);
      } catch (dropError) {
        console.log(`⚠️  Could not drop ${tableName}:`, dropError.message);
      }
    }
    
    // Sync models in dependency order to avoid foreign key errors
    console.log('🔄 Syncing all database models in dependency order...');
    
    // Phase 1: Base tables (no dependencies)
    const phase1 = ['User', 'Role', 'Permission', 'Student', 'Tutor', 'BlogPost', 'Contact'];
    
    // Phase 2: Junction tables (depend on User, Role, Permission)
    const phase2 = ['RolePermission', 'UserRole'];
    
    // Phase 3: Course (depends on Tutor)
    const phase3 = ['Course'];
    
    // Phase 4: Tables that depend on Course
    const phase4 = ['Payment', 'StudentCourse'];
    
    const syncResults = {};
    
    // Sync Phase 1
    console.log('📦 Phase 1: Base tables...');
    for (const modelName of phase1) {
      try {
        const Model = models[modelName];
        if (Model) {
          await Model.sync({ alter: false, force: false });
          syncResults[modelName] = 'success';
          console.log(`✅ Synced: ${modelName}`);
        }
      } catch (modelError) {
        syncResults[modelName] = modelError.message;
        console.error(`⚠️  Error syncing ${modelName}:`, modelError.message);
      }
    }
    
    // Sync Phase 2: Junction tables with force to recreate correctly
    console.log('📦 Phase 2: Junction tables...');
    for (const modelName of phase2) {
      try {
        const Model = models[modelName];
        if (Model) {
          // Use force: true to completely recreate junction tables
          await Model.sync({ alter: false, force: true });
          syncResults[modelName] = 'success';
          console.log(`✅ Synced: ${modelName}`);
        }
      } catch (modelError) {
        syncResults[modelName] = modelError.message;
        console.error(`⚠️  Error syncing ${modelName}:`, modelError.message);
      }
    }
    
    // Sync Phase 3: Course (needs Tutor to exist)
    console.log('📦 Phase 3: Course (depends on Tutor)...');
    for (const modelName of phase3) {
      try {
        const Model = models[modelName];
        if (Model) {
          await Model.sync({ alter: false, force: false });
          syncResults[modelName] = 'success';
          console.log(`✅ Synced: ${modelName}`);
        }
      } catch (modelError) {
        syncResults[modelName] = modelError.message;
        console.error(`⚠️  Error syncing ${modelName}:`, modelError.message);
      }
    }
    
    // Sync Phase 4: Tables that depend on Course
    console.log('📦 Phase 4: Payment and StudentCourse (depend on Course)...');
    for (const modelName of phase4) {
      try {
        const Model = models[modelName];
        if (Model) {
          await Model.sync({ alter: false, force: false });
          syncResults[modelName] = 'success';
          console.log(`✅ Synced: ${modelName}`);
        }
      } catch (modelError) {
        syncResults[modelName] = modelError.message;
        console.error(`⚠️  Error syncing ${modelName}:`, modelError.message);
      }
    }
    
    console.log('✅ Database sync completed');
    
    // Count successful vs failed syncs
    const successful = Object.values(syncResults).filter(r => r === 'success').length;
    const failed = Object.values(syncResults).filter(r => r !== 'success').length;
    const total = phase1.length + phase2.length + phase3.length + phase4.length;
    
    res.json({
      success: true,
      message: `Database sync completed. ${successful} models synced successfully${failed > 0 ? `, ${failed} had warnings` : ''}.`,
      timestamp: new Date().toISOString(),
      database: 'synced',
      syncResults: syncResults,
      summary: {
        successful,
        failed,
        total
      }
    });
  } catch (error) {
    console.error('❌ Database sync error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Database sync failed',
      error: error.message,
      ...(env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }
});

// API Routes with lazy database initialization AND lazy route loading
// Routes are loaded on first request to prevent Passenger timeout
app.use('/api', lazyDbInit, (req, res, next) => {
  try {
    const routeHandler = loadRoutes();
    // Execute route handler - errors will be caught by global error handler
    routeHandler(req, res, next);
  } catch (err) {
    console.error('⚠️  Error loading or executing routes:', err.message);
    console.error('⚠️  Stack:', err.stack);
    // Ensure we return JSON, not HTML
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({
        success: false,
        message: 'Route error: ' + (err.message || 'Unknown error'),
        ...(env.NODE_ENV === 'development' && { stack: err.stack })
      });
    } else {
      // If headers already sent, pass to error handler
      next(err);
    }
  }
});

// Root endpoint - serve API info
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'TayseerulQuran Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      courses: '/api/courses',
      users: '/api/users'
    }
  });
});

// 404 handler (for API routes only) - ensure it returns JSON
app.use((req, res, next) => {
  // Only handle API routes with 404
  if (req.path.startsWith('/api')) {
    if (!res.headersSent) {
      res.setHeader('Content-Type', 'application/json');
      res.status(404).json({
        success: false,
        message: `API route ${req.originalUrl} not found`
      });
    }
  } else {
    // For non-API routes, use the notFoundHandler
    notFoundHandler(req, res, next);
  }
});

// Global error handler (must be last)
// ALWAYS return JSON, never HTML - this prevents Passenger HTML error pages
app.use((err, req, res, next) => {
  // Always return JSON, never HTML
  if (!res.headersSent) {
    const statusCode = err.statusCode || err.status || 500;
    const message = err.message || 'Internal server error';
    
    // Set content type to JSON explicitly - CRITICAL to prevent HTML responses
    res.setHeader('Content-Type', 'application/json');
    
    // Log error for debugging
    console.error('❌ Error caught by global handler:', {
      message: message,
      path: req.path,
      method: req.method,
      status: statusCode
    });
    
    res.status(statusCode).json({
      success: false,
      message: message,
      ...(env.NODE_ENV === 'development' && { 
        stack: err.stack,
        name: err.name 
      })
    });
  } else {
    // Headers already sent, just log
    console.error('❌ Error after headers sent:', err.message);
  }
});

// Check if running under Passenger (Plesk)
const isPassenger = process.env.PASSENGER_APP_ENV || process.env.PASSENGER;

// Start server (only if not running under Passenger)
const startServer = async () => {
  try {
    // Only start listening if NOT running under Passenger
    // Passenger manages the server itself
    // Database will initialize on first API request (lazy initialization)
    if (!isPassenger) {
      const PORT = env.PORT;
      app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📝 Environment: ${env.NODE_ENV}`);
        console.log(`🌐 API URL: http://localhost:${PORT}/api`);
        console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`📝 Database will initialize on first API request`);
      });
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections (only register once)
// CRITICAL: Don't let unhandled rejections crash the app in production
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  console.error('❌ Promise:', promise);
  console.error('❌ Stack:', err.stack);
  // In production, log but don't exit - let Passenger handle it
  // Exiting would cause Passenger to serve HTML error page
  if (env.NODE_ENV === 'development') {
    process.exit(1);
  }
  // In production, just log - the app should continue
});

// Handle uncaught exceptions (only register once)
// CRITICAL: Don't let uncaught exceptions crash the app in production
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.error('❌ Stack:', err.stack);
  // In production, log but don't exit - let Passenger handle it
  // Exiting would cause Passenger to serve HTML error page
  if (env.NODE_ENV === 'development') {
    process.exit(1);
  }
  // In production, just log - the app should continue
});

// Export app immediately (critical for Passenger - must be before any async operations)
// NO database initialization here - it will happen on first API request (lazy initialization)
module.exports = app;

// For Passenger, just log - no database initialization
if (isPassenger) {
  console.log('🚀 Passenger detected - app ready');
  console.log('📝 Environment:', env.NODE_ENV);
  console.log('🌐 App module loaded successfully');
  console.log('📝 Database will initialize on first API request (lazy initialization)');
  // NO database initialization here - prevents Passenger timeout
} else {
  // For standalone mode, start the server normally
  try {
    startServer();
  } catch (err) {
    console.error('❌ Failed to start server:', err);
  }
}

