var express = require('express');
var server = express();
var path = require('path');
var http = require('http').Server(server);
var io = require('socket.io')(http);
var port = 3000;
var IP = '0.0.0.0';

//var port = process.env.PORT || 3000;
//var IP = process.env.IP || '0.0.0.0';

//set Express port
server.set('port', port);

//set 'public' as static directory
server.use(express.static(path.join(__dirname, '/public')));

//load page (index.html)
server.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/public/page/index.html'));
});

//listen on port and output logs
http.listen(port, IP, function() {
	console.log('listening on port ' + port);
});