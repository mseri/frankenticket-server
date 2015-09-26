'use strict';

var Hapi = require('hapi');
var routes = require('./routes.js');
var db = require('./db.js').sequelize;
var BTAPI = require('./lib/bthack.js');
var WebSocket = require('ws');

var ws;

function wsConnect() {
  ws = new WebSocket(BTAPI.state.socketServer + "/" + BTAPI.state.sessionKey);
}

var server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3000
});

for (var i in routes) {
  server.route(routes[i]);
}

db.sync().then(function() {
  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });

  BTAPI.auth()
    .then(wsConnect)
    .then(function() {
      ws.on('message', function(message) {
        console.log(JSON.stringify(JSON.parse(message.data), null, "\t") + "\n\n");
      });
      ws.on('open', function() {
        console.log('websocket connected');
      });
    })
    .catch(function(err) {
      console.log('Error 0', err);
    });
});
