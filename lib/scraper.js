var request = require('request')
var cheerio = require('cheerio')

module.exports = {
  getTickets: getTickets,
  checkTicket: checkTicket
}

/*
HOW TO:
var log = console.log.bind(console)

var url = 'https://billetto.co.uk/en/events/the-haggerston-improv-festival/tickets'
var ticket = 'SUN 8PM ABANDOMAN'

getTickets(url, log)
checkTicket(url, ticket, log)
*/

function getTickets(url, cb) {
  getPage(url, function (err, $){
    if (err) return cb && cb(err)
    var tickets = []
    var rowSelector = 'tr:has(.app-basket__vip-ticket-title)'
    $(rowSelector).each(ticketPusher($, tickets))
    cb && cb(null, tickets)
  })
}

function checkTicket(url, ticket, cb) {
  getTickets(url, function(err, tickets){
    if (err) return cb && cb(err)
    for (var name in tickets) {
      if (name === ticket) {
        return cb && cb(null, tickets[name])
      }
    }
    cb("Ticket not found")
  })
}

function getPage(url, cb){
  request(url, function (err, response, html) {
    if (err) return cb && cb(err)
    cb && cb(null, cheerio.load(html))
  })
} 

function ticketPusher($, tickets){
  return function(i, elem) {
    var nameSelector = '.app-basket__vip-ticket-title strong'
    var availabilitySelector = '.js-basket-form__quantity'
    var priceSelector = '.text--right'
    
    var name = $(this).find(nameSelector).text()
    var availability = !!$(this).find(availabilitySelector).length
    var price = priceValue($(this).find(priceSelector).eq(0).text())
    var fee = priceValue($(this).find(priceSelector).eq(1).text())
    tickets[name] = {
      availability: availability,
      price: (price + fee) || 0
    }
  }
}

function priceValue(priceString) {
  return parseFloat(priceString.replace(/[^0-9.]/g, ''))
}
