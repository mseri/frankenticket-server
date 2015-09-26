'use strict';

var getUsers = require('./routes/getUsers');
var postGuest = require('./routes/postGuest');
var postUser = require('./routes/postUser');
var postGroup = require('./routes/postGroup');
var postRequest = require('./routes/postRequest');
var getTickets = require('./routes/getTickets');
var clientToken = require('./routes/clientToken');
var billettoNotification = require('./routes/billettoNotification');

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
}, {
  method: 'POST',
  path: '/billetto-notification',
  handler: billettoNotification
}];
