'use strict';

var db = require('../db.js');

module.exports = function(request, reply) {
  db.User.findAll().then(function(res){
    var users = [];
    res.forEach(function(e){
      users.push({
        id: e.dataValues.id,
        fullName: e.dataValues.fullName,
        phone: e.dataValues.phone
      });
    });
    reply(users);
  });
};
