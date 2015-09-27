'use strict';

var scheduleCall = require('../lib/bthack').scheduleCall;
var braintree = require('../lib/braintree');
var db = require('../db.js');

var SENDER = 'tel:+442079595059';

module.exports = function(request, reply) {
  var body = request.payload

  db.Request.findAll({
    where: {
      url: body.url,
      ticket: body.ticket,
//       quantity: {
//         $lte: body.quantity
//       }
    }
  }).then(function(res) {
    res.forEach(callAndBook(body))
    reply({
      ok: true
    })
  });
}

function callAndBook(ticket) {
  return function(event) {
    var request = event.dataValues
    makeCall(request.number, !!request.paymentToken, function(err, wantsToPay) {
      if (wantsToPay) {
        console.log("pay", request.paymentToken, ticket.price);
        braintree.createTransaction(request.paymentToken, ticket.price)
      }
    })
  }
}

// successful payment must be managed by the callback.
function makeCall(number, isPaid, cb) {
  console.log(number, isPaid);
  var message = "Hi, the ticket you wanted to book is now available. ";
  if (isPaid) {
    message += "Press 1 if you want to book it, otherwise just hang up and ";
  } else {
    message += "To buy it, ";
  }
  message += "visit tickethub.com";


  scheduleCall(SENDER, number, message, function(error, dtmf) {
    console.log("Got DTMF: ", dtmf);
    if (dtmf.length > 0 && dtmf[0].digits.indexOf("1") !== -1) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  });
}
