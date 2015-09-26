'use strict';

var db = require('../db.js');

module.exports = function(request, reply) {
  // TODO add validation
  var guest = request.payload;

  db.User.findById(guest.visiting).then(function(res){
    // There is a user to visit with that ID
    if(res.dataValues){
      db.Guest.create(guest).then(function(res){
        reply(res.dataValues.id).code(201);
      });
    }
    // there is nobody to visit with that ID
    else {
      reply({
        error:{
          message: "There is no user with that ID to visit"
        }
      }).code(400);
    }
  });
};
