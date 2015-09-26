var braintree = require('braintree')

module.exports = {
  createCustomer: createCustomer,
  clientToken: clientToken,
  createTransaction: createTransaction
}

/*
HOW TO:
createCustomer: create a customer on braintree.
Send user data and you'll get back the user enriched with the braintree customer id and paymentToken.

createTransation: bill a customer on braintree
Send the token and the amount

*/

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANTID,
  publicKey: process.env.BRAINTREE_PUBLICKEY,
  privateKey: process.env.BRAINTREE_PRIVATEKEY
});

function createCustomer(data, cb){
  console.log(data)
  gateway.customer.create({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    paymentMethodNonce: data.payment_method_nonce
  }, function (err, result) {
    if (err) return cb && cb(err);
    console.log(result)
    if (!result.success || !result.customer ||
      !result.customer.id || !result.customer.creditCards ||
      result.customer.creditCards.length===0 ||
      !result.customer.creditCards[0].token){
      console.log('Unable to retrieve Card Details')
      return cb && cb('Unable to retrieve Card Details')
    }
    data.customerId = result.customer.id
    data.paymentToken = result.customer.creditCards[0].token
    console.log(data)
    return cb && cb(null, data)
  });
};

function clientToken(cb) {
  gateway.clientToken.generate({}, function(err, response){
    return cb && cb(err, response ? response.clientToken : '')
  });
};

function createTransaction(token, amount, cb){
  gateway.transaction.sale({
    paymentMethodToken: token,
    amount: amount
  }, function (err, result) {
    if (err) return cb && cb(err)
    if (result.success) {
      cb && cb(null, result.transaction.id)
    }
  })
}
