// Entry point for server code.
const express = require('express');

// Set up an Express app.
const app = express();
const server = exports.server = require('http').Server(app);
const io = require('socket.io')(server);

const consts = require('./consts');
const PORT = require('./settings').port;

// Serve static files at the root path.
app.use('/', express.static('static'));

io.on('connection', (socket) => {
  let name = 'Anonymous';
  socket.emit('news', { message: `Welcome, ${name}!` });
  socket.broadcast.emit('news', { message: `${name} has joined the chat.` });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on(consts.EVENT_USER_SEND_CHAT, (msg) => {
    if (msg.indexOf('/name ') !== -1) {
      const newName = msg.replace('/name ', '');
      io.emit('news', { message: `${name} is now known as ${newName}.` });
      name = newName;
    } else if (msg.trim()) {
      io.emit(consts.EVENT_USER_RECV_CHAT, { name, message: msg });
    }
  });
});

// Start the app.
exports.start = () => {
  server.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
  });
};
