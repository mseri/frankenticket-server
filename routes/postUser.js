'use strict';
var db = require('../db.js');

module.exports = function(request, reply) {
  // TODO add validation
  var user = request.payload;
  db.User.create(user).then(function(query) {
    console.log(query);
    // return the ID so the frontend knows the user ID just created
    reply(query.dataValues.id).code(201);
  });
};
