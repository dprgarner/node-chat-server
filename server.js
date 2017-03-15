// Entry point for server code.
const express = require('express');

// Set up an Express app.
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const settings = require('./settings')[process.env.NODE_ENV];
const PORT = settings.port;

// Serve static files at the root path.
app.use('/', express.static('static'));

io.on('connection', function (socket) {
  let name = 'Anonymous';
  socket.emit('news', { message: `Welcome, ${name}!` });
  socket.broadcast.emit('news', { message: `${name} has joined the chat.` });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('disconnect', function () {
    console.log('User disconnected');
  });

  socket.on('chat message', function(msg) {
    if (msg.indexOf('/name ') !== -1) {
      const newName = msg.replace('/name ', '');
      io.emit('news', { message: `${name} is now known as ${newName}.` });
      name = newName;
    } else if (msg.trim()) {
      io.emit('message', { name, message: msg });
    }
  });
});

// Start the app.
server.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
});
