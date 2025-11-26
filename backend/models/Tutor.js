const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  tutorId: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true,
    comment: 'Custom tutor ID'
  },
  specialization: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  experience: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Years of experience'
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  isApproved: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    comment: 'Approved by Super Admin'
  },
  approvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  approvedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalStudents: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalCourses: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0.00,
    validate: {
      min: 0,
      max: 5
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'tutors'
});

module.exports = Tutor;

