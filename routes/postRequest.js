'use strict';

var braintree = require('../lib/braintree')
var db = require('../db.js')

module.exports = function(request, reply) {
  var body = request.payload
  braintree.createCustomer(body, function(err, user) {
    if (err) throw err
    db.Request.create(user).then(function(query) {
      reply(query.dataValues.id).code(201);
    });
  })
}
 
