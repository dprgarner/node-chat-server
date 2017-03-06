// Entry point for server code.
const express = require('express');

// Set up an Express app.
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const PORT = 8080;

// Serve static files at the root path.
app.use('/', express.static('static'));

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
  socket.on('disconnect', function () {
    console.log('User disconnected')
  });
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('news', { message: msg });
  });
});

// Start the app.
server.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
});
