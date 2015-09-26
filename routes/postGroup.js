'use strict';

var db = require('../db.js');

module.exports = function(request, reply) {
  // TODO add validation
  var group = request.payload;
  db.Group.create(group).then(function(query) {
    console.log(query);
    // return the ID so the frontend knows the Group ID just created
    reply(query.dataValues.id).code(201);
  });
};
