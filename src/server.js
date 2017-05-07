import http from 'http';

import express from 'express';
import expressSession from 'express-session';
import sharedSession from 'express-socket.io-session';
import socketIo from 'socket.io';

import consts from './consts';
import { port } from '../settings';

export default class Server {
  constructor() {
    const app = express();
    const sessionMiddleware = expressSession({
      secret: 'my-secret',
      resave: true,
      saveUninitialized: true
    });
    app.use(sessionMiddleware);

    // Serve static files at the root path.
    app.use('/', express.static('static'));

    this.server = http.createServer(app);
    this.io = socketIo(this.server);
    this.io.use(sharedSession(sessionMiddleware));

    this.io.on('connect', (socket) => this.handleConnect(socket));
  }

  start(cb) {
    this.server.listen(port, (err) => {
      cb && cb(err);
    });
  }

  close(cb) {
    this.server.close(cb);
  }

  initialiseSession(session) {
    if (!session.name) {
      session.name = 'Anonymous';
      session.save();
    }
  }

  handleConnect(socket) {
    const session = socket.handshake.session;
    this.initialiseSession(session);

    socket.emit(consts.EVENT_NEWS, {
      message: `Welcome, ${session.name}!`,
    });
    socket.broadcast.emit(consts.EVENT_NEWS, {
      message: `${session.name} has joined the chat.`,
    });

    // Socket-specific listeners
    socket.on('disconnect', () => this.handleDisconnect(socket));
    socket.on(consts.EVENT_USER_SEND_CHAT, message => (
      this.handleMessage(socket, message)
    ));
  }

  handleDisconnect(socket) {
    console.log('User disconnected');
  }

  handleMessage(socket, msg) {
    const session = socket.handshake.session;
    if (msg.indexOf('/name ') !== -1) {
      const newName = msg.replace('/name ', '');
      this.io.emit(consts.EVENT_NEWS, {
        message: `${session.name} is now known as ${newName}.`,
      });
      session.name = newName;
      session.save();
    } else if (msg.trim()) {
      this.io.emit(consts.EVENT_USER_RECV_CHAT, {
        name: session.name,
        message: msg,
      });
    }
  }
}