'use strict';

var Sequelize = require('sequelize');
var UserModel = require('./models/user.js');
var GuestModel = require('./models/guest.js');
var RequestModel = require('./models/request.js');
var GroupModel = require('./models/group.js');
var GroupUsersJoinModel = require('./models/groupUsers.js');

var sequelize = new Sequelize(process.env.DATABASE_URL + "?ssl=on", {
  dialectOptions: {
    ssl: true
  },
  dialect: 'postgres',
  protocol: 'postgres'
});

var User = sequelize.define('User', UserModel);
var Request = sequelize.define('Request', RequestModel);
var Guest = sequelize.define('Guest', GuestModel);
var Group = sequelize.define('Group', GroupModel);
var GroupUserJoin = sequelize.define('GroupUsers', GroupUsersJoinModel);

module.exports = {
  sequelize: sequelize,
  User: User,
  Guest: Guest,
  Group: Group,
  GroupUser: GroupUserJoin,
  Request: Request
};
