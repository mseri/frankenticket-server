'use strict';

var scraper = require('../lib/scraper')

module.exports = function(request, reply) {
  var body = request.payload
  scraper.getTickets(body.url, function(err, data){
    if (err) throw err
    reply(data)
  })
}
