'use strict';

var scheduleCall = require('./lib/bthack.js').scheduleCall;
var BTAPI = require('./lib/bthack.js');

BTAPI.init();

setTimeout(function() {
  makeCall('sip:+442079595060@sandbox.demo.alcatel-lucent.com', true, function(err, paid) {
    if (err) {
      return console.log(err);
    }
    console.log(paid);
  });
}, 2000);

function makeCall(number, isPaid, cb) {
  console.log(number, isPaid);
  var message = "Hi, the ticket you wanted to book is now available. ";
  if (isPaid) {
    message += "Press 1 if you want to book it, otherwise just hang up and ";
  } else {
    message += "To buy it, ";
  }
  message += "visit tickethub.com";



  scheduleCall('tel:+442079595059', number, message, function(error, dtmf) {
    console.log("Got DTMF: ", dtmf);
    if (dtmf.length > 0 && dtmf[0].digits.indexOf("1") !== -1) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  });
}
