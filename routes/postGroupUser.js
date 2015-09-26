'use strict';

var db = require('../db.js');

module.exports = function(request, reply) {
  // TODO add validation
  var groupUser = {
    groupId: request.payload.groupId,
    phone: request.payload.phone
  };

  db.GroupUsers.create(groupUser).then(function(query) {
    console.log(query);
    reply().code(201);
  });
};
