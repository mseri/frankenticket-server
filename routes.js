'use strict';

var getUsers = require('./routes/getUsers.js');
var postGuest = require('./routes/postGuest.js');
var postUser = require('./routes/postUser.js');
var postGroup = require('./routes/postGroup.js');

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
}];
