/**
 * Test script to check if seed data exists in database
 * Run this to verify if users and roles were created
 */

const { User, Role, UserRole } = require('./models');
const { ROLES } = require('./utils/constants');

async function checkSeedStatus() {
  try {
    console.log('🔍 Checking seed data status...\n');

    // Check roles
    const roles = await Role.findAll();
    console.log(`📋 Roles found: ${roles.length}`);
    roles.forEach(role => {
      console.log(`   - ${role.name} (ID: ${role.id})`);
    });

    // Check test users
    const testEmails = [
      'superadmin@tayseerulquran.com',
      'admin@tayseerulquran.com',
      'tutor@tayseerulquran.com',
      'staff@tayseerulquran.com',
      'student@tayseerulquran.com'
    ];

    console.log('\n👥 Checking test users...');
    for (const email of testEmails) {
      const user = await User.findOne({
        where: { email },
        include: [{
          model: Role,
          as: 'roles',
          through: { attributes: [] }
        }]
      });

      if (user) {
        const roleNames = user.roles.map(r => r.name).join(', ');
        console.log(`   ✅ ${email} - Roles: ${roleNames || 'None'}`);
      } else {
        console.log(`   ❌ ${email} - NOT FOUND`);
      }
    }

    // Count total users
    const totalUsers = await User.count();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

    console.log('\n✅ Seed status check complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking seed status:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  checkSeedStatus();
}

module.exports = { checkSeedStatus };




