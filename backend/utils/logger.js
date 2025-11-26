const morgan = require('morgan');
const env = require('../config/env');

// Custom log format
const logFormat = env.NODE_ENV === 'production' 
  ? 'combined' 
  : 'dev';

// Create logger middleware
const logger = morgan(logFormat);

// Custom logger functions
const logInfo = (message) => {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
};

const logError = (message, error = null) => {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  if (error) {
    console.error(error);
  }
};

const logWarning = (message) => {
  console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
};

module.exports = {
  logger,
  logInfo,
  logError,
  logWarning
};

