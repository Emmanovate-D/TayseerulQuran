require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
  
  // Database
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || 'tayseerulquran_db',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret_change_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
  JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '30d',
  
  // CORS - Can be a single origin string or comma-separated list
  // For development, you can use '*' to allow all origins
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5500,http://localhost:8080,http://127.0.0.1:5500,http://127.0.0.1:8080',
};

// Validate required environment variables
const requiredVars = ['DB_NAME', 'DB_USER', 'JWT_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName] && env[varName].includes('default'));

if (missingVars.length > 0 && env.NODE_ENV === 'production') {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

module.exports = env;

