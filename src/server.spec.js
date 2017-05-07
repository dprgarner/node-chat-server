import io from 'socket.io-client';
import sinon from 'sinon';
import { expect } from 'chai';

import consts from './consts';
import Server from './server';
import { host, port } from '../settings';

const serverUrl = `http://${host}:${port}`;

describe('server-side', () => {
  const server = new Server();

  beforeEach(done => {
    server.start(done);
  });

  afterEach(done => {
    server.close(done);
  });

  it('allows a client to connect', (done) => {
    const client = io.connect(serverUrl);
    client.once('connect', () => {
      done();
    });
  });

  it('allows a user to change their name', (done) => {
    const client = io.connect(serverUrl);

    client.on(consts.EVENT_NEWS, (newsData) => {
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
      expect(newsData.name).to.equal('Anonymous');
      expect(newsData.message).to.equal(expectedMessage);
      done();
    });

    client.once('connect', () => {
      client.emit(consts.EVENT_USER_SEND_CHAT, expectedMessage);
    });
  });

  it('does not post an empty message', () => {
    const stub = sinon.stub(server.io, 'emit');
    server.handleMessage({ handshake: {} }, '    ');
    expect(server.io.emit.callCount).to.equal(0);
    stub.restore();
  });

  it('sets the username to a default value', () => {
    const fakeSession = {
      save: sinon.spy(),
    };
    server.initialiseSession(fakeSession);
    expect(fakeSession.name).to.equal('Anonymous');
    expect(fakeSession.save.callCount).to.equal(1);
  });

  it('does not save the session if a username is present', () => {
    const fakeSession = {
      name: 'Roxy',
      save: sinon.spy(),
    };
    server.initialiseSession(fakeSession);
    expect(fakeSession.name).to.equal('Roxy');
    expect(fakeSession.save.callCount).to.equal(0);
  });
});
