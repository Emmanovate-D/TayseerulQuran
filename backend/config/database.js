const { Sequelize } = require('sequelize');
const env = require('./env');

// Create Sequelize instance
const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: 'mysql',
    logging: env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      connectTimeout: 5000, // 5 seconds timeout (reduced for Passenger)
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 5000, // 5 seconds (reduced for Passenger)
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true
    }
  }
);

// Test database connection with timeout
const testConnection = async () => {
  try {
    // Wrap authenticate in a timeout promise
    const authenticatePromise = sequelize.authenticate();
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 5000);
    });
    
    await Promise.race([authenticatePromise, timeoutPromise]);
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error.message);
    return false;
  }
};

module.exports = {
  sequelize,
  testConnection
};

