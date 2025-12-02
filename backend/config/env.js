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
  
  // Email Configuration
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: process.env.EMAIL_PORT || 587,
  EMAIL_SECURE: process.env.EMAIL_SECURE || 'false',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',
  EMAIL_FROM: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@tayseerulquran.com',
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'TayseerulQuran',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5500',
  
  // Payment Gateway Configuration
  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // PayPal
  PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID || '',
  PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET || '',
  PAYPAL_WEBHOOK_SECRET: process.env.PAYPAL_WEBHOOK_SECRET || '',
  PAYPAL_MODE: process.env.PAYPAL_MODE || 'sandbox', // 'sandbox' or 'live'
};

/**
 * Get payment gateway configuration
 * @param {string} gatewayType - 'stripe', 'paypal', or 'bank_transfer'
 * @returns {object} Gateway configuration object
 */
env.getGatewayConfig = function(gatewayType) {
  const isProduction = env.NODE_ENV === 'production';
  
  switch (gatewayType.toLowerCase()) {
    case 'stripe':
      return {
        secretKey: env.STRIPE_SECRET_KEY || 'test_key',
        publishableKey: env.STRIPE_PUBLISHABLE_KEY || '',
        webhookSecret: env.STRIPE_WEBHOOK_SECRET || 'test_webhook_secret',
        sandbox: !isProduction
      };
    
    case 'paypal':
      return {
        clientId: env.PAYPAL_CLIENT_ID || '',
        clientSecret: env.PAYPAL_CLIENT_SECRET || '',
        webhookSecret: env.PAYPAL_WEBHOOK_SECRET || 'test_webhook_secret',
        mode: env.PAYPAL_MODE || 'sandbox', // 'sandbox' or 'live'
        sandbox: env.PAYPAL_MODE !== 'live'
      };
    
    case 'bank_transfer':
      return {
        // Bank transfer doesn't require API keys
        sandbox: !isProduction
      };
    
    default:
      throw new Error(`Unsupported payment gateway: ${gatewayType}`);
  }
};

// Validate required environment variables
const requiredVars = ['DB_NAME', 'DB_USER', 'JWT_SECRET'];
const missingVars = requiredVars.filter(varName => !process.env[varName] && env[varName].includes('default'));

if (missingVars.length > 0 && env.NODE_ENV === 'production') {
  console.error(`Missing required environment variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

module.exports = env;

