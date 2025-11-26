const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const StudentCourse = sequelize.define('StudentCourse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  enrollmentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  completionDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  progress: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    },
    comment: 'Progress percentage'
  },
  status: {
    type: DataTypes.ENUM('enrolled', 'in_progress', 'completed', 'dropped'),
    defaultValue: 'enrolled'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    }
  },
  review: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'student_courses',
  indexes: [
    {
      unique: true,
      fields: ['studentId', 'courseId']
    }
  ]
});

module.exports = StudentCourse;

