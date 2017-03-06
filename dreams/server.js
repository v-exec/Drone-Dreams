//setup
var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

//set 'public' as static directory
app.use(express.static('public'));

var port = 3000;
var IP = '0.0.0.0';

//pool of available socket slots, each available one given to unique user as they join
slots = [];

//set Express port
app.set('port', port);

//find the first free slot in slots[]
function getFree() {
	var i = slots.indexOf(null);
	return i !== -1 ? i : slots.length;
}

//on client connection, get the first free slot in slots[]
//on client disconnect, free up the slot occupied by client
io.on('connection', function (client) {
  var index = getFree();
  slots[index] = client;
  console.log("connect", index);
  client.on('data', function (data) { console.log("data", index, data); });
  client.on('disconnect', function () {
  	console.log("disconnect", index);
    slots[index] = null;
  });
});

//listen on port and output logs
server.listen(port, IP, function() {
	console.log('listening on port ' + port);
});