const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shortDescription: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    validate: {
      min: 0
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Duration in hours'
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: true,
    defaultValue: 'beginner'
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tutorId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tutors',
      key: 'id'
    }
  },
  isPublished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  enrollmentCount: {
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
  }
}, {
  tableName: 'courses'
});

module.exports = Course;

