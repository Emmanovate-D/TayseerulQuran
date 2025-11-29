const { sequelize } = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Permission = require('./Permission');
const RolePermission = require('./RolePermission');
const UserRole = require('./UserRole');
const Course = require('./Course');
const Student = require('./Student');
const Tutor = require('./Tutor');
const BlogPost = require('./BlogPost');
const Payment = require('./Payment');
const StudentCourse = require('./StudentCourse');
const Contact = require('./Contact');

// Define associations
const defineAssociations = () => {
  // User - Role (Many-to-Many)
  User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles'
  });
  
  Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users'
  });

  // Role - Permission (Many-to-Many)
  Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: 'roleId',
    otherKey: 'permissionId',
    as: 'permissions'
  });
  
  Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: 'permissionId',
    otherKey: 'roleId',
    as: 'roles'
  });

  // User - Course (Many-to-Many through StudentCourse)
  User.belongsToMany(Course, {
    through: StudentCourse,
    foreignKey: 'studentId',
    otherKey: 'courseId',
    as: 'enrolledCourses'
  });
  
  Course.belongsToMany(User, {
    through: StudentCourse,
    foreignKey: 'courseId',
    otherKey: 'studentId',
    as: 'students'
  });

  // Course - Tutor (Many-to-One)
  Course.belongsTo(Tutor, {
    foreignKey: 'tutorId',
    as: 'tutor'
  });
  
  Tutor.hasMany(Course, {
    foreignKey: 'tutorId',
    as: 'courses'
  });

  // Tutor - User (One-to-One)
  Tutor.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  User.hasOne(Tutor, {
    foreignKey: 'userId',
    as: 'tutorProfile'
  });

  // Student - User (One-to-One)
  Student.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  User.hasOne(Student, {
    foreignKey: 'userId',
    as: 'studentProfile'
  });

  // Payment - User (Many-to-One)
  Payment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
  
  User.hasMany(Payment, {
    foreignKey: 'userId',
    as: 'payments'
  });

  // Payment - Course (Many-to-One)
  Payment.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'course'
  });
  
  Course.hasMany(Payment, {
    foreignKey: 'courseId',
    as: 'payments'
  });

  // StudentCourse - User (Many-to-One)
  StudentCourse.belongsTo(User, {
    foreignKey: 'studentId',
    as: 'User'
  });
  
  User.hasMany(StudentCourse, {
    foreignKey: 'studentId',
    as: 'enrollments'
  });

  // StudentCourse - Course (Many-to-One)
  StudentCourse.belongsTo(Course, {
    foreignKey: 'courseId',
    as: 'Course'
  });
  
  Course.hasMany(StudentCourse, {
    foreignKey: 'courseId',
    as: 'enrollments'
  });

  // BlogPost - User (Many-to-One)
  BlogPost.belongsTo(User, {
    foreignKey: 'authorId',
    as: 'author'
  });
  
  User.hasMany(BlogPost, {
    foreignKey: 'authorId',
    as: 'blogPosts'
  });
};

// Initialize associations
defineAssociations();

module.exports = {
  sequelize,
  User,
  Role,
  Permission,
  RolePermission,
  UserRole,
  Course,
  Student,
  Tutor,
  BlogPost,
  Payment,
  StudentCourse,
  Contact
};

