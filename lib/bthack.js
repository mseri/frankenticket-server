"use strict";

var popsicle = require('popsicle');
var WebSocket = require('ws');
var uuid = require('node-uuid');

// TODO move this to a config file
var APIState = {
  server: "http://cowlinen.ddns.net",
  socketServer: "ws://cowlinen.ddns.net",
  user: "hack10",
  password: "toad25",
  apiKey: "3437a998-198e-11e5-82f0-00247e00963f",
  userID: null,
  sessionKey: null,
  webSocket: null
};

var callbacks = {};
var locations = {};
var staticcallback;

// TODO deal with unsuccesful connections instead of trying just once
function init() {
  authBTAPI()
    .then(function() {
      if (!isAuthenticated()) {
        console.log("Not Authenticated yet");
        authBTAPI().then(wsConnect());
      } else {
        console.log("Succesfully Authenticated!");
        wsConnect();
      }
    })
    .then(function() {
      APIState.webSocket.on('message', function(message) {
        manageMessage(message);
      });
      APIState.webSocket.on('open', function() {
        console.log('Websocket connected');
      });
    })
    .catch(function(err) {
      console.log('Error 0: ', err);
    });
}


function isAuthenticated() {
  return !(APIState.userID === null || APIState.sessionKey === null);
}


function authBTAPI() {
  return new Promise(function(resolve, reject) {
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
          return resolve('Successfully connected!');
        } else {
          console.log("Server reply error: {userID: ", userID, ", sessionKey: ", sessionKey, "}.");
          return reject("Error 1");
        }
      } else {
        console.log("Authentication error. Response: ", res.body);
        return reject("Error 2");
      }
    });
  });
}


function wsConnect() {
  var url = APIState.socketServer + "/" + APIState.sessionKey;
  APIState.webSocket = new WebSocket(url);
}


function manageMessage(message) {
  //whose body will match the callleg schema
  // console.log("Call data is " + message);

  var msg = JSON.parse(message);
  console.log(msg);

  var responseId = msg["X-BT-FV-Correlation-Key"] || staticcallback;

  var location = locations[responseId] || null;

  if (!location && msg.type === "CALL_EVENT") {
    location = msg.location;
    locations[responseId] = location;

    var body = {
      "announcement": {
        "text":  "the ticket you wanted to book is now available. Press 1 if you want to book it, otherwise just hang up and visit tickethub.com"
      },
      "dtmf": {
        "maxDigits": 5,
        "minDigits": 1,
      }
    };
    console.log(location);
    sendRequestOverSocket(responseId, location, 'PUT', body, null);
  }

  if (callbacks[responseId] && msg.type === "CALL_EVENT" && msg.body.status === "TERMINATED") {
    var dtmf = msg.body.dtmf;
    callbacks[responseId](null, dtmf);
    delete callbacks[responseId];
  }
}


function sendRequestOverSocket(uid, url, method, body, callback) {
  if (callback) {
    callbacks[uid] = callback;
  }
  var httpRequest = {
    url: url,
    method: method,
    body: body,
    "X-BT-FV-Correlation-Key": uid
  };
  APIState.webSocket.send(JSON.stringify(httpRequest));
  console.log("SENT MESSAGE", httpRequest);
}


// sender and receiver must be in the form:
// "tel:+13334441010"
// "sip:+13334441178@sandbox.demo.alcatel-lucent.com"
function attemptCall(senderAddress, receiverAddress, message, callback) {
  var url = "/" + APIState.userID + "/calllegs";
  var uid = uuid.v4();
  staticcallback = uid;
  var body = {
    "sourceAddress": senderAddress,
    "targetAddress": receiverAddress,
    "announcement": {
      "text": "Hi "
    }
  };

  sendRequestOverSocket(uid, url, 'POST', body, callback);
}


module.exports = {
  scheduleCall: attemptCall,
  init: init
};
