var braintree = require('braintree')
var loopback = require('loopback')

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANTID,
  publicKey: process.env.BRAINTREE_PUBLICKEY,
  privateKey: process.env.BRAINTREE_PRIVATEKEY
});

function createCustomer(data, cb){
  gateway.customer.create({
    firstName: data.name,
    lastName: data.surname,
    email: data.email,
    paymentMethodNonce: data.payment_method_nonce
  }, function (err, result) {
    if (err) return cb(err);
    if (!result.success || !result.customer ||
      !result.customer.id || !result.customer.creditCards ||
      result.customer.creditCards.length===0 ||
      !result.customer.creditCards[0].token){
      cb && cb('Unable to retrieve Card Details')
    }
    data.customerId = result.customer.id
    data.paymentToken = result.customer.creditCards[0].token
    cb && cb(null, data)
  });
};

function clientToken(id, cb) {
  gateway.clientToken.generate({
    customerId: id
  }, function(err, response){
    cb && cb(err, response ? response.clientToken : '')
  });
};

function createTransaction(token, amount, cb){
  gateway.transaction.sale({
    paymentMethodToken: token,
    amount: amount
  }, function (err, result) {
    if (err) cb && cb(err)
    if (result.success) {
      cb && cb(null, result.transaction.id)
    }
  })
}
