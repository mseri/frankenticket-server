'use strict';

var braintree = require('../lib/braintree')
var db = require('../db.js')

module.exports = function(request, reply) {
  var body = request.payload
  //select * from Requests where url = body.url and ticket = body.ticket
  //call Request.number
  //if Request.paymentToken && the user press the buying number
  //braintree.createTransaction(Request.paymentToken, body.price)
  reply("Unimplemented")
}