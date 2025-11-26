const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const UserRole = sequelize.define('UserRole', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  }
}, {
  tableName: 'user_roles',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'roleId']
    }
  ]
});

module.exports = UserRole;

