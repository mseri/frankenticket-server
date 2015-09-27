'use strict';

var braintree = require('../lib/braintree')
var db = require('../db.js')

module.exports = function(request, reply) {
  var body = request.payload
  db.Request.findAll({
    where: {
      url: body.url,
      ticket: body.ticket,
      quantity: {
        $lte: body.quantity
      }
    }
  }).then(function(res){
    res.forEach(callAndBook(body))
    reply({ ok: true })
  });
}

function callAndBook(ticket) {
  return function(event) {
    var request = event.dataValues
    makeCall(request.number, !!request.paymentToken, function(err, wantsToPay) {
      if (wantsToPay) {
        console.log("pay", request.paymentToken, ticket.price)
        braintree.createTransaction(request.paymentToken, ticket.price)
      }
    })
  }
}

function makeCall(data, isPaid, cb) {
  console.log(data, isPaid)
  cb && cb(null, true)
}