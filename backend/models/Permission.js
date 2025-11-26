const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Permission = sequelize.define('Permission', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resource: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  action: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  tableName: 'permissions'
});

module.exports = Permission;

