"use strict";

var popsicle = require('popsicle');
var db = require('../db.js');

var sender = 'tel:+13334441010';

// TODO move this to a config file
var APIState = {
  server: "http://cowlinen.ddns.net",
  socketServer: "ws://cowlinen.ddns.net",
  user: "hack10",
  password: "toad25",
  apiKey: "3437a998-198e-11e5-82f0-00247e00963f",
  userID: null,
  sessionKey: null
};

function generateMessage(guest, user) {
  return "Hello this is the reception, we have " + guest + " here to visit " + user;
}


function isAuthenticated() {
  return !(APIState.userID === null || APIState.sessionKey === null);
}


function authBTAPI() {
  return new Promise(function(reject, resolve) {
    var credentials = APIState.user + ":" + APIState.password;
    var encoded64 = new Buffer(credentials).toString('base64');
    var authString = "Basic " + encoded64;

    var uri = APIState.server + "/login";

    popsicle({
      url: uri,
      method: "POST",
      headers: {
        'X-BT-FV-API-Key': APIState.apiKey,
        'Authorization': authString
      }
    }).then(function(res) {
      if (res.status === 200) {
        var userID = res.get("x-bt-fv-userid");
        var sessionKey = res.get("x-bt-fv-session");

        if (userID && sessionKey) {
          APIState.userID = userID;
          APIState.sessionKey = sessionKey;
					console.log(APIState.userID, APIState.sessionKey);
          return resolve();
        } else {
          console.log("Server reply error: {userID: ", userID, ", sessionKey: ", sessionKey, "}.");
          return reject();
        }
      } else {
        console.log("Authentication error. Response: ", res.body);
        return reject();
      }
    });
  });
}

function callGroup(guest, group) {
  return new Promise(function(resolve, reject) {
    if (isAuthenticated) {
      db.GroupUsers.findAll({
        where: {
          groupId: group
        }
      }).then(function(res) {
        var numbersToCall = [];
        res.forEach(function(e) {
          console.log(e);
          numbersToCall.push(e.dataValues);
        });
        var i = 0;

        function tryNumber() {
          i++;
          if (i === numbersToCall.length) {
            return reject({
              error: {
                message: 'Nobody answered'
              }
            });
          }
          // TODO change Mattia
          var message = generateMessage(guest, 'Mattia');
          attemptCall(sender, numbersToCall[i], message)
            .then(function() {
              return resolve(numbersToCall[i]);
            })
            .catch(tryNumber);
        }

        tryNumber();
      });
    } else {
      authBTAPI().then(function() {
        callGroup(guest, group);
      }, function(err) {
        return new Error(err);
      });
    }
  });
}


// sender and receiver must be in the form:
// "tel:+13334441010"
// "sip:+13334441178@sandbox.demo.alcatel-lucent.com"
function attemptCall(senderAddress, receiverAddress, message) {
  return new Promise(function(resolve, reject) {
    var url = APIState.server + "/" + APIState.userID + "/calllegs";
    var callCall = {
      uri: url,
      method: 'POST',
      headers: {
        'X-BT-FV-Session': APIState.sessionKey,
        'Content-Type': "application/json"
      },
      json: {
        "sourceAddress": senderAddress,
        "targetAddress": receiverAddress,
        "announcement": {
          "text": message
        }
      }
    };

    popsicle(callCall)
      .then(function(res) {
        if (res.status === 201) {
          return resolve();
        } else {
          return reject();
        }
      });
  });
}

module.exports = {
  callGroup: callGroup,
  state: APIState,
  auth: authBTAPI
};
