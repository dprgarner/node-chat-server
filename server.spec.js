const expect = require('chai').expect;
const io = require('socket.io-client');

const settings = require('./settings');
const serverUrl = `http://${settings.host}:${settings.port}`;

describe('server-side', () => {
  const io = require('socket.io-client');

  const { server, start } = require('./server.js');

  beforeEach(() => {
    start();
  });

  afterEach(() => {
    server.close();
  });

  it('allows a client to connect', (done) => {
    const client = io.connect(serverUrl);
    client.once('connect', () => {
      done();
    });
  });

  it('allows a user to change their name', (done) => {
    const client = io.connect(serverUrl);

    client.on('news', (newsData) => {
      const expectedMessage = 'Anonymous is now known as newName.';
      if (newsData.message === expectedMessage) done();
    });

    client.once('connect', () => {
      client.emit('chat message', '/name newName')
    });
  });

  it('allows a user to send a non-empty message', (done) => {
    const client = io.connect(serverUrl);
    const expectedMessage = 'Hello world!';

    client.on('message', (newsData) => {
      if (newsData.name === 'Anonymous' && newsData.message === expectedMessage) {
        done();
      }
    });

    client.once('connect', () => {
      client.emit('chat message', expectedMessage);
    });
  });

  it('does not post an empty message');
});
