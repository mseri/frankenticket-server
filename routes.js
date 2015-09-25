'use strict';
var getUsers = require('./routes/getUsers.js');
var postGuest = require('./routes/postGuest.js');

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
  path: '/guest',
  handler: postGuest
}];
