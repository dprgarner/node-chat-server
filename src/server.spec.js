const expect = require('chai').expect;
const io = require('socket.io-client');
const sinon = require('sinon');

const consts = require('./consts');
const settings = require('../settings');
const serverUrl = `http://${settings.host}:${settings.port}`;
const { server, start, io: serverIo, handleMessage, initialiseSession } = require('./server');

describe('server-side', () => {
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
      client.emit(consts.EVENT_USER_SEND_CHAT, '/name newName')
    });
  });

  it('allows a user to send a non-empty message', (done) => {
    const client = io.connect(serverUrl);
    const expectedMessage = 'Hello world!';

    client.on(consts.EVENT_USER_RECV_CHAT, (newsData) => {
      if (newsData.name === 'Anonymous' && newsData.message === expectedMessage) {
        done();
      }
    });

    client.once('connect', () => {
      client.emit(consts.EVENT_USER_SEND_CHAT, expectedMessage);
    });
  });

  it('does not post an empty message', () => {
    const stub = sinon.stub(serverIo, 'emit');
    handleMessage(null, '    ');
    expect(serverIo.emit.callCount).to.equal(0);
    stub.restore();
  });

  it('sets the username to a default value', () => {
    const fakeSession = {
      save: sinon.spy(),
    };
    initialiseSession(fakeSession);
    expect(fakeSession.name).to.equal('Anonymous');
    expect(fakeSession.save.callCount).to.equal(1);
  });

  it('does not save the session if a username is present', () => {
    const fakeSession = {
      name: 'Roxy',
      save: sinon.spy(),
    };
    initialiseSession(fakeSession);
    expect(fakeSession.name).to.equal('Roxy');
    expect(fakeSession.save.callCount).to.equal(0);
  });
});
