'use strict';

var braintree = require('../lib/braintree')
var db = require('../db.js')

module.exports = function(request, reply) {
  braintree.clientToken(function(err, token){
    if (err) throw err
    reply({ token: token })
  })
}