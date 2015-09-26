'use strict';

var getUsers = require('./routes/getUsers.js');
var postGuest = require('./routes/postGuest.js');
var postUser = require('./routes/postUser.js');
var postGroup = require('./routes/postGroup.js');
var postRequest = require('./routes/postRequest.js');
var getTickets = require('./routes/getTickets.js');
var clientToken = require('./routes/clientToken.js');

module.exports = [{
  method: 'GET',
  path: '/',
  handler: function(request, reply) {
    reply('Hello, world!');
  }
}, {
  method: 'GET',
  path: '/users',
  handler: getUsers
}, {
  method: 'POST',
  path: '/users',
  handler: postUser
}, {
  method: 'POST',
  path: '/guest',
  handler: postGuest
}, {
  method: 'POST',
  path: '/group',
  handler: postGroup
}, {
  method: 'POST',
  path: '/tickets-availability',
  handler: getTickets
}, {
  method: 'POST',
  path: '/requests',
  handler: postRequest
}, {
  method: 'GET',
  path: '/client-token',
  handler: clientToken
}];
