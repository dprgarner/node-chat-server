import io from 'socket.io';
import sinon from 'sinon';
import { expect } from 'chai';

import consts from './consts';
import settings from '../settings';
import { Client } from './client.js';

function waitFor(assertion) {
    // Attempt an assertion repeatedly until it passes or times out. The
    // argument 'assertion' can be a synchronous function which throws an
    // error, or a promise generator.

    const interval = 25;
    const timeout = 500;
    const attempts = Math.floor(timeout / interval);

    function tryAgain() {
        // Wait a short interval, and then attempt the assertion again.
        return new Promise(resolve => setTimeout(resolve, interval))
        .then(assertion);
    }

    let chainedPromise = Promise.resolve().then(assertion);
    for (let j = 0; j < attempts; j++) {
        // Attempt to resolve the assertion repeatedly.
        chainedPromise = chainedPromise.catch(tryAgain);
    }
    return chainedPromise;
}

describe('client-side', () => {
  let client;
  let server;

  beforeEach(done => {
    server = io.listen(settings.port);
    client = new Client().start();
    server.once('connect', () => {
      client.socket.on('connect', done);
    });
  });

  afterEach(done => {
    let nCalled = 0;

    function cb() {
      if (++nCalled === 2) {
        return done();
      }
    }

    client.socket.once('disconnect', cb);
    server.close(cb);
  });

  it('should append news to the end of the message list', () => {
    expect(client.$messagesUl.children()).to.have.length(0);

    server.emit(consts.EVENT_NEWS, {message: 'hello world'});

    return waitFor(() => {
      expect(client.$messagesUl.children()).to.have.length(1);
      expect(client.$messagesUl.html()).to.contain('hello world');
    });
  });

  it('should append messages to the end of the message list', () => {
    expect(client.$messagesUl.children()).to.have.length(0);
    client.$messagesUl.append('<li/>');
    expect(client.$messagesUl.children()).to.have.length(1);

    server.emit(consts.EVENT_USER_RECV_CHAT, {message: 'my message'});

    return waitFor(() => {
      expect(client.$messagesUl.children()).to.have.length(2);
      expect(client.$messagesUl.html()).to.contain('my message');
    });
  });

  it('should send messages from the message box', () => {
    client.$inputBox.val('some message');
    sinon.stub(client.socket, 'emit');

    client.$form.submit();

    expect(client.socket.emit.called).to.be.true;
    client.socket.emit.restore();
  });

  it('has a reference to the usersTypingBox div', () => {
    expect(client.$usersTypingBox).to.be.ok;
    expect(client.$usersTypingBox.text()).to.not.be.ok;
  });

  it('displays the list of users contained in the event', () => {
    const userMessage = 'David and Robert are typing.';

    server.emit('USERS_TYPING', userMessage);

    return waitFor(() => {
        expect(client.$usersTypingBox.text()).to.equal(userMessage);
    });
  });
});
