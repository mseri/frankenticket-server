'use strict';
var Hapi = require('hapi');
var routes = require('./routes.js');

var server = new Hapi.Server();
server.connection({ port: 3000 });

for (var i in routes) {
  server.route(routes[i]);
}

server.start(function () {
    console.log('Server running at:', server.info.uri);
});
