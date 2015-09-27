'use strict';

var Hapi = require('hapi');
var routes = require('./routes.js');
var db = require('./db.js').sequelize;
var BTAPI = require('./lib/bthack.js');

var server = new Hapi.Server();
server.connection({
  port: process.env.PORT || 3000,
  routes: { cors: true }
});

for (var i in routes) {
  server.route(routes[i]);
}

db.sync().then(function() {
  server.start(function() {
    console.log('Server running at:', server.info.uri);
  });

  BTAPI.init();
});
