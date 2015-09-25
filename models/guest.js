'use strict';
var Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  visiting: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
};
