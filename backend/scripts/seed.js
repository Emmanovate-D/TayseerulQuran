const { User, Role, UserRole, Permission, RolePermission } = require('../models');
const { ROLES, PERMISSIONS } = require('../utils/constants');

/**
 * Seed database with initial data
 * Safe to run multiple times - won't duplicate data
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Check if roles already exist
    const existingRoles = await Role.count();
    if (existingRoles > 0) {
      console.log('✅ Roles already exist. Skipping role creation.');
    } else {
      // Create roles
      console.log('📝 Creating roles...');
      const roles = await Role.bulkCreate([
        { name: ROLES.SUPER_ADMIN, description: 'Full system access' },
        { name: ROLES.ADMIN, description: 'Administrative access' },
        { name: ROLES.TUTOR, description: 'Teaching and course management' },
        { name: ROLES.STAFF, description: 'Staff access' },
        { name: ROLES.STUDENT, description: 'Student access' }
      ], { ignoreDuplicates: true });
      console.log(`✅ Created ${roles.length} roles`);
    }

    // Get roles for user assignment
    const superAdminRole = await Role.findOne({ where: { name: ROLES.SUPER_ADMIN } });
    const adminRole = await Role.findOne({ where: { name: ROLES.ADMIN } });
    const tutorRole = await Role.findOne({ where: { name: ROLES.TUTOR } });
    const staffRole = await Role.findOne({ where: { name: ROLES.STAFF } });
    const studentRole = await Role.findOne({ where: { name: ROLES.STUDENT } });

    // Create test users if they don't exist
    const testUsers = [
      {
        email: 'superadmin@tayseerulquran.com',
        password: 'SuperAdmin123!',
        firstName: 'Super',
        lastName: 'Admin',
        role: superAdminRole
      },
      {
        email: 'admin@tayseerulquran.com',
        password: 'Admin123!',
        firstName: 'Admin',
        lastName: 'User',
        role: adminRole
      },
      {
        email: 'tutor@tayseerulquran.com',
        password: 'Tutor123!',
        firstName: 'Tutor',
        lastName: 'Instructor',
        role: tutorRole
      },
      {
        email: 'staff@tayseerulquran.com',
        password: 'Staff123!',
        firstName: 'Staff',
        lastName: 'Member',
        role: staffRole
      },
      {
        email: 'student@tayseerulquran.com',
        password: 'Student123!',
        firstName: 'Student',
        lastName: 'Learner',
        role: studentRole
      }
    ];

    let usersCreated = 0;
    for (const userData of testUsers) {
      const existingUser = await User.findOne({ where: { email: userData.email } });
      
      if (!existingUser) {
        const user = await User.create({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isActive: true,
          isEmailVerified: true
        });

        // Assign role
        if (userData.role) {
          await UserRole.create({
            userId: user.id,
            roleId: userData.role.id
          });
        }

        usersCreated++;
        console.log(`✅ Created user: ${userData.email} (${userData.role.name})`);
      } else {
        console.log(`⏭️  User already exists: ${userData.email}`);
      }
    }

    if (usersCreated > 0) {
      console.log(`✅ Created ${usersCreated} test users`);
    } else {
      console.log('✅ All test users already exist');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    testUsers.forEach(user => {
      console.log(`Role: ${user.role.name.toUpperCase()}`);
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });

    return true;
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    // Don't throw - allow server to start even if seeding fails
    return false;
  }
};

module.exports = { seedDatabase };

