const express = require('express');
const router = express.Router();
const { sequelize } = require('../config/database');

/**
 * Migration endpoint to add email token fields
 * GET /api/migrations/add-email-token-fields
 * This endpoint can be called once to add the required columns
 */
router.get('/add-email-token-fields', async (req, res) => {
  try {
    console.log('🔄 Starting migration: Adding email token fields to users table...');

    // Check if columns already exist
    const [existingColumns] = await sequelize.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME IN ('emailVerificationToken', 'passwordResetToken')
    `);

    const existingColumnNames = existingColumns.map(col => col.COLUMN_NAME);
    const columnsToAdd = [];

    if (!existingColumnNames.includes('emailVerificationToken')) {
      columnsToAdd.push('emailVerificationToken VARCHAR(255) NULL');
      columnsToAdd.push('emailVerificationTokenExpiry DATETIME NULL');
    }

    if (!existingColumnNames.includes('passwordResetToken')) {
      columnsToAdd.push('passwordResetToken VARCHAR(255) NULL');
      columnsToAdd.push('passwordResetTokenExpiry DATETIME NULL');
    }

    if (columnsToAdd.length === 0) {
      return res.json({
        success: true,
        message: 'All email token fields already exist. Migration not needed.',
        columns: existingColumnNames
      });
    }

    // Add columns
    const alterQuery = `
      ALTER TABLE users 
      ADD COLUMN ${columnsToAdd.join(', ADD COLUMN ')}
    `;

    await sequelize.query(alterQuery);
    
    const addedColumns = columnsToAdd.map(col => col.split(' ')[0]);
    console.log('✅ Successfully added email token fields:', addedColumns.join(', '));

    return res.json({
      success: true,
      message: 'Successfully added email token fields to users table',
      addedColumns: addedColumns
    });

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // If it's a "duplicate column" error, that's okay
    if (error.message.includes('Duplicate column name')) {
      return res.json({
        success: true,
        message: 'Some columns may already exist. This is safe to ignore.',
        warning: error.message
      });
    }
    
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Migration failed. Please check the error message.'
    });
  }
});

module.exports = router;

