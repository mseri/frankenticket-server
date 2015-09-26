"use strict";

var popsicle = require('popsicle')
  , WebSocket = require('ws')
  , uuid = require('node-uuid');

var sender = 'tel:+13334441010';

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

var calls = {};


// TODO deal with unsuccesful connections instead of trying just once
function init() {
  authBTAPI()
    .then(wsConnect())
    .then(function() {
      ws.on('message', manageMessage(message));
      ws.on('open', function() {
        console.log('Websocket connected');
      });
    })
    .catch(function(err) {
      console.log('Error: ', err);
    });;
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
  var url = APIstate.socketServer + "/" + APIstate.sessionKey;
  APIState.webSocket = new WebSocket(url);
}


function manageMessage(message) {
  var message = JSON.parse(message.data);

  //this is a message about a call
  console.log("Call resource is " + message.url);

  //whose body will match the callleg schema
  console.log("Call data is " + message.body);

  var responseId = message["X-BT-FV-Correlation-Key"];
  if (calls[responseId]) {
    if (message.type = "CALL_EVENT") {
      //http://cowlinen.ddns.net/{userID}/callLegs/{callLegID}
      calls[responseId].location = message.location;

      var dtmf = message.body.dtmf;
      if length(dtmf > 0) {
        calls[responseId].callback()
      }

      if message.body.status == "TERMINATED" {
        delete calls[responseId];
      }
    }
  }
}


function sendRequestOverSocket(uid, url, method, body, callback) {
  calls[uid] = {};
  calls[uid].callback = callback;
  var httpRequest = {
    url: url,
    method: method,
    body: body,
    "X-BT-FV-Correlation-Key": uid
  };
  APIState.webSocket.send(JSON.stringify(httpRequest));
  console.log("SENT MESSAGE", httpRequest);
};


// sender and receiver must be in the form:
// "tel:+13334441010"
// "sip:+13334441178@sandbox.demo.alcatel-lucent.com"
function attemptCall(senderAddress, receiverAddress, message, callback) {
    var url = "/" + APIState.userID + "/calllegs";
    var uid = uuid.v4();
    var body = {
      "sourceAddress": senderAddress,
      "targetAddress": receiverAddress,
      "announcement": {
        "text": message
    };
    
    sendRequestOverSocket(uid, url, 'POST', body, function(message) {
      // maybe we do something with it and then
      callback(message);
    });
}

module.exports = {
  scheduleCall: attemptCall,
  init: init
};