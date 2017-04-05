const express = require('express');
const app = express();
const server = exports.server = require('http').createServer(app);
const io = require('socket.io')(server);
const sessionMiddleware = require('express-session')({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true
});
const sharedsession = require('express-socket.io-session');
const consts = require('./consts');
const PORT = require('./settings').port;

app.use(sessionMiddleware);

// Serve static files at the root path.
app.use('/', express.static('static'));

io.use(sharedsession(sessionMiddleware));

function handleMessage(session, msg) {
  if (msg.indexOf('/name ') !== -1) {
    const newName = msg.replace('/name ', '');
    io.emit('news', {
      message: `${session.name} is now known as ${newName}.`,
    });
    session.name = newName;
    session.save();
  } else if (msg.trim()) {
    io.emit(consts.EVENT_USER_RECV_CHAT, {
      name: session.name,
      message: msg,
    });
  }
}

function initialiseSession(session) {
  if (!session.name) {
    session.name = 'Anonymous';
    session.save();
  }
}

io.on('connection', (socket) => {
  const session = socket.handshake.session;
  initialiseSession(session);

  socket.emit('news', {
    message: `Welcome, ${session.name}!`,
  });
  socket.broadcast.emit('news', {
    message: `${session.name} has joined the chat.`,
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on(
    consts.EVENT_USER_SEND_CHAT,
    message => handleMessage(session, message)
  );
});

// Start the app.
exports.start = () => {
  server.listen(PORT, () => {
    console.log('Listening on port ' + PORT)
  });
};

exports.handleMessage = handleMessage
exports.initialiseSession = initialiseSession;
exports.io = io;
