'use strict';

var braintree = require('../lib/braintree')
var db = require('../db.js')

module.exports = function(request, reply) {
  var body = request.payload
  if (!body.payment_method_nonce) {
    return createUser(null, body)
  }
  braintree.createCustomer(body, createUser)
  
  function createUser(err, user) {
    if (err) throw err
    db.Request.create(user).then(function(query) {
      reply(query.dataValues.id).code(201)
    })
  }
}