var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;
var app = require('http').createServer(function(request, response) {
 
  var uri = url.parse(request.url).pathname,
        filename = path.join(__dirname, "/../", uri);
  
  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }
 
    if (fs.statSync(filename).isDirectory()) filename += '/index.html';
 
    fs.readFile(filename, "binary", function(err, file) {
      if(err) {
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }
 
      response.writeHead(200);
      response.write(file, "binary");
      response.end();
    });
  });
}),
// io = require('socket.io',).listen(app),
// fixed http://stackoverflow.com/questions/8350630/nodejs-with-socket-io-delay-emitting-data
io = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] }).listen(app),
fs = require('fs');

app.listen(4000);

io.sockets.on('connection', function (socket) {
	socket.on('newQuestion', function (data) {
		fs.appendFile(__dirname+'/data.js', JSON.stringify(data) + '\n', function(err) {
			if (err) throw err;
			socket.emit('newQuestionSaved');
		});
	});

	socket.on('pollUpdate', function(poll) {
		var line, parsedLine, contents = fs.readFileSync(__dirname+'/data.js', {encoding: 'utf8'}).split('\n');
		
		for (line in contents) {
			if (contents[line].length > 0) {
				parsedLine = JSON.parse(contents[line]);
				if (parsedLine.id == poll.id) {
					contents[line] = JSON.stringify(poll);
				}
			}
			else contents.splice(line, 1);
		}

		fs.writeFile(__dirname+'/data.js', contents.join('\n'), function(err) {
			if (err) throw err;
			socket.emit('pollUpdateSuccess', poll);
		});
	});

	socket.on('questionsRequest', function() {
		fs.readFile(__dirname+'/data.js', {encoding: 'utf8'}, function(err, data) {
			socket.emit('questionsData', data.split('\n'));
		});

	});	
});
