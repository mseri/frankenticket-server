"use strict";

var popsicle = require('popsicle');

// TODO move this to a config file
var APIState = {
	server: "http://cowlinen.ddns.net/",
	user: "frankenstein",
	password: "junior",
	apiKey: "3437a998-198e-11e5-82f0-00247e00963f",
	userID: null,
	sessionKey: null
};


function isAuthenticated () {
	return !(APIState.userID === null || APIState.sessionKey === null);
}


function authBTAPI() {
	var credentials = APIState.user + ":" + APIState.password;
	var encoded64 = new Buffer(credentials).toString('base64');
	var authString = "Basic " + encoded64;
	
	var uri = APIState.server + "/login";

	popsicle({
		url: uri,
		method: "POST",
		headers: {
			'X-BT-FV-API-Key': APIState.apikey,
			'Authorization' : authString
		}
	}).then(function(res) {
		if(res.status === 200) {
			var userID = res.get("x-bt-fv-userid");
			var sessionKey = res.get("x-bt-fv-session");
			
			if (userID && sessionKey) {
				APIState.userID = userID;
				APIState.ses = sessionKey;	
			} else {
				console.log("Server reply error: {userID: ", userID, ", sessionKey: ", sessionKey, "}.");		
			}
		} else {
			console.log("Authentication error. Response: ", res);
		}
	});		
}


function callGroup(user, group) {
	throw new Error("Not Implemented");	
}


// sender and receiver must be in the form:
// "tel:+13334441010"
// "sip:+13334441178@sandbox.demo.alcatel-lucent.com"
function attemptCall(senderAddress, receiverAddress, message) {
	var url = APIState.server + "/" + APIState.userID + "/calllegs";
	
	var callCall = {
		uri: url,
		method: 'POST',
		headers: {
			'X-BT-FV-Session': APIState.sessionKey,
			'Content-Type' : "application/json"
		},
		json: {
			"sourceAddress" : senderAddress,
			"targetAddress" : receiverAddress,
			"announcement" : {
				"text" : message
			}
		}
	};
	
	popsicle(callCall).then(function (res) {
		
	});
}