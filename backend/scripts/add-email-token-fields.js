/**
 * Migration script to add email token fields to users table
 * Run this script once to add the new columns to existing databases
 * 
 * Usage: node backend/scripts/add-email-token-fields.js
 */

const { sequelize } = require('../config/database');

async function addEmailTokenFields() {
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
      console.log('✅ All email token fields already exist. Migration not needed.');
      return;
    }

    // Add columns
    const alterQuery = `
      ALTER TABLE users 
      ADD COLUMN ${columnsToAdd.join(', ADD COLUMN ')}
    `;

    await sequelize.query(alterQuery);
    console.log('✅ Successfully added email token fields to users table');
    console.log('   Added columns:', columnsToAdd.map(col => col.split(' ')[0]).join(', '));

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    // If it's a "duplicate column" error, that's okay
    if (error.message.includes('Duplicate column name')) {
      console.log('⚠️  Some columns may already exist. This is safe to ignore.');
    } else {
      throw error;
    }
  } finally {
    await sequelize.close();
  }
}

// Run migration
addEmailTokenFields()
  .then(() => {
    console.log('✅ Migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Migration error:', error);
    process.exit(1);
  });

