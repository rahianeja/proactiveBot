'use strict';

var restify = require('restify');
var builder = require('botbuilder');
var server = restify.createServer();

server.use(restify.bodyParser({
    requestBodyOnGet: true
}));


server.listen(process.env.port || process.env.PORT || 3978, function () {
  console.log('%s listening to %s', server.name, server.url); 
});

// setup bot credentials
var connector = new builder.ChatConnector({
  appId: "fcf46302-da5b-431a-a739-77d9b63fc6a6",
  appPassword: "vjjqkIQRS214!;uhDOK25#:"
  // appId: process.env.MICROSOFT_APP_ID,
  // appPassword: process.env.MICROSOFT_APP_PASSWORD

});

var bot = new builder.UniversalBot(connector);

// send simple notification
// function sendProactiveMessage(address) {
//   var msg = new builder.Message().address(address);
//   msg.text('Violation occurred');
//   msg.textLocale('en-US');
//   bot.send(msg);
// };
function sendProactiveMessageToAddress(address, message) {
  console.dir("came to proactive msg call");
  var msg = new builder.Message().address(address);
  msg.text(message);
  msg.textLocale('en-US');
  bot.send(msg);
};

var savedAddress;
server.post('/api/messages', connector.listen());

// Do GET this endpoint to delivey a notification
server.post('/api/CustomWebApi', (req, res, next) => {
  //  sendProactiveMessage(savedAddress);
  //  console.log("Request is : " + req);
  //  console.log("Response is : " + res);
    console.dir(req.body.address);
    console.dir(req.body.message);
    
    sendProactiveMessageToAddress(req.body.address, req.body.message);
    res.send('triggered');
    next();
  }
);

// root dialog
bot.dialog('/', function(session, args) {

  savedAddress = session.message.address;
  console.dir("Add is : "+JSON.stringify(savedAddress));
  var message = 'Hello! Information about violation will be notified';
  session.send("your address is : "+ JSON.stringify(savedAddress));
  //session.send(message);
  //message = 'You can also make me send a message by accessing: ';
  //message += 'http://localhost:' + server.address().port + '/api/CustomWebApi';
  session.send(message);
  // setTimeout(() => {
  //  sendProactiveMessage(savedAddress);
  // }, 5000);
});
