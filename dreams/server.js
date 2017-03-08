//references setup
var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var net = require('net');

//set 'public' as static directory
app.use(express.static('public'));

//server properties
var port = process.env.PORT || 3000;
var IP = process.env.IP || '0.0.0.0';
var pdPort = 666;
var pdIP = '0.0.0.0';

//set Express port
app.set('port', port);

//pool of available socket slots, each available one given to unique user as they join
var slots = [];

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

  client.on('data', function (data) {
  	console.log(index, data);
  	if (connection_established) {
  	  pd.write(index + " " + data + ";");
  	}
  });
  
  client.on('disconnect', function () {
  	console.log("disconnect", index);
    slots[index] = null;
  });
});

//setup Pd connection
var pd = new net.Socket();
var connection_established = false;

pd.connect(pdPort, pdIP, function() {
	console.log('pd connection established');
	connection_established = true;
});

//listen on port
server.listen(port, IP, function() {
	console.log('listening on ' + port);
});