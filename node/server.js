var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = Number(process.env.PORT || 5000);
// port = process.argv[2] || 8888;

//creation of HTTP Server
var app = http.createServer(function(request, response) {
 
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
});

app.listen(port, function() {
  console.log("Listening on " + port);
});

io = require('socket.io').listen(app);


// fixed http://stackoverflow.com/questions/8350630/nodejs-with-socket-io-delay-emitting-data
// io = require('socket.io', { rememberTransport: false, transports: ['WebSocket', 'Flash Socket', 'AJAX long-polling'] }).listen(app);
fs = require('fs');



io.sockets.on('connection', function (socket) {

            // when we receive newQuestion from the client we .. 
            // .. write to the data.js file the answer from Add New Question form
	socket.on('newQuestion', function (data) {
                        // in order the data.js file to be transformed at the client side into json we have
                        // to put , between question
		fs.appendFile(__dirname+'/data.js', ',' + JSON.stringify(data) + '\n', function(err) {
			if (err) throw err;
                                        // we tell the client that the server has saved the Question.
			socket.emit('newQuestionSaved');
		});
	});

            // when we receive pollUpdate from the client we ..
            // .. receive the poll updated object from the client and ..
	socket.on('pollUpdate', function(poll) {
                         // .. read the data.js file  and put them to .. 
                         //  .. contents  that will be an array with the values of data split by  '\n'
		var item, parsedLine, polls = fs.readFileSync(__dirname+'/data.js', {encoding: 'utf8'});

                        polls = "[" + polls+ "]";

                        try {
                            polls = JSON.parse(polls);
                        } catch (e) {
                            console.log(' error parsing polls');
                        }

                        console.log(polls);

                        for (item in polls) {
                            // we found our updated poll
                            // we break  from the loop
                            if (polls[item].id === poll.id) {
                                polls.splice(item, 1, poll);
                                break;
                            }
                        }

                        polls = JSON.stringify(polls);

                        // we delete [] that we added
                        polls = polls.substring(1, polls.length-1);

		fs.writeFile(__dirname+'/data.js', polls, function(err) {
			if (err) throw err;
			socket.emit('pollUpdateSuccess', poll);
		});
	});

             // when we receive questionsRequest from the client we...
             // .. read data.js  and we send back the data stored to the client
	socket.on('questionsRequest', function() {
		fs.readFile(__dirname+'/data.js', {encoding: 'utf8'}, function(err, data) {
                                        var response = data;
			socket.emit('questionsData', response);
		});

	});
});
