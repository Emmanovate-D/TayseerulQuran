const { User, Role, UserRole, Permission, RolePermission, sequelize } = require('../models');
const { ROLES, PERMISSIONS } = require('../utils/constants');

/**
 * Seed database with initial data
 * Safe to run multiple times - won't duplicate data
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Ensure UserRole table exists (junction table for many-to-many)
    try {
      await UserRole.sync({ alter: false });
      console.log('✅ UserRole table verified');
    } catch (syncError) {
      console.error('⚠️  UserRole table sync warning:', syncError.message);
      // Try to create table manually if sync fails
      try {
        await sequelize.query(`
          CREATE TABLE IF NOT EXISTS user_roles (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            roleId INT NOT NULL,
            createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE KEY unique_user_role (userId, roleId),
            FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        console.log('✅ UserRole table created manually');
      } catch (createError) {
        console.error('❌ Failed to create UserRole table:', createError.message);
        // Continue anyway - might already exist
      }
    }

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
    let rolesAssigned = 0;
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
          try {
            // Check if role assignment already exists
            const existingAssignment = await UserRole.findOne({
              where: {
                userId: user.id,
                roleId: userData.role.id
              }
            });

            if (!existingAssignment) {
              await UserRole.create({
                userId: user.id,
                roleId: userData.role.id
              });
              console.log(`   ✓ Assigned role: ${userData.role.name}`);
              rolesAssigned++;
            } else {
              console.log(`   ⏭️  Role already assigned: ${userData.role.name}`);
            }
          } catch (roleError) {
            console.error(`   ❌ Failed to assign role to ${userData.email}:`, roleError.message);
            // Continue with next user
          }
        }

        usersCreated++;
        console.log(`✅ Created user: ${userData.email} (${userData.role.name})`);
      } else {
        // User exists - check and assign role if missing
        if (userData.role) {
          try {
            const existingAssignment = await UserRole.findOne({
              where: {
                userId: existingUser.id,
                roleId: userData.role.id
              }
            });

            if (!existingAssignment) {
              await UserRole.create({
                userId: existingUser.id,
                roleId: userData.role.id
              });
              console.log(`✅ Assigned role to existing user: ${userData.email} → ${userData.role.name}`);
              rolesAssigned++;
            } else {
              console.log(`⏭️  User already exists: ${userData.email} (role: ${userData.role.name})`);
            }
          } catch (roleError) {
            console.error(`   ❌ Failed to assign role to ${userData.email}:`, roleError.message);
          }
        } else {
          console.log(`⏭️  User already exists: ${userData.email}`);
        }
      }
    }

    if (usersCreated > 0) {
      console.log(`✅ Created ${usersCreated} test users`);
    } else {
      console.log('✅ All test users already exist');
    }
    
    if (rolesAssigned > 0) {
      console.log(`✅ Assigned ${rolesAssigned} roles to users`);
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

