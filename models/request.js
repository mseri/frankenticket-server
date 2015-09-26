'use strict';

var Sequelize = require('sequelize');

module.exports = {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  url: {
    type: Sequelize.STRING
  },
  ticket: {
    type: Sequelize.STRING
  },
  quantity: {
    type: Sequelize.INTEGER
  },
  firstName: {
    type: Sequelize.STRING
  },
  lastName: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  number: {
    type: Sequelize.STRING
  },
  paymentToken: {
    type: Sequelize.STRING
  }
}; 
