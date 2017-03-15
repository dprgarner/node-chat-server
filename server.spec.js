const expect = require('chai').expect;
const io = require('socket.io-client');

const settings = require('./settings');
const serverUrl = `http://${settings.host}:${settings.port}`;

describe('server-side', () => {
  const io = require('socket.io-client');

  beforeEach(() => {
    require('./server.js')
  });

  afterEach(() => {
    // Something needs to go here to shut down the server!
  });

  it('allows a client to connect', done => {
    const client = io.connect(serverUrl);
    client.once('connect', () => {
      done();
    });
  });
});
