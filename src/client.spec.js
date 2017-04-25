import consts from './consts';
import io from 'socket.io';
import settings from '../settings';
import sinon from 'sinon';
import {Client} from './client.js';
import {expect} from 'chai';

function callbackSpy(obj, name, cb) {
  const func = obj[name];

  sinon.stub(obj, name).callsFake(() => {
    func.apply(obj, arguments);
    cb();
  });
}

describe('client-side', () => {
  let client;
  let server;

  beforeEach(done => {
    client = new Client();
    server = io.listen(settings.port);
    client.start();
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

  it('should append news to the end of the message list', done => {
    expect(client.messagesUl.children()).to.have.length(0);

    server.emit(consts.EVENT_NEWS, {message: 'hello world'});

    callbackSpy(client, 'scrollToBottom', () => {
      expect(client.messagesUl.children()).to.have.length(1);
      expect(client.messagesUl.html()).to.contain('hello world');
      done();
    });
  });

  it('should append messages to the end of the message list', done => {
    expect(client.messagesUl.children()).to.have.length(0);

    server.emit(consts.EVENT_USER_RECV_CHAT, {message: 'my message'});

    callbackSpy(client, 'scrollToBottom', () => {
      expect(client.messagesUl.children()).to.have.length(1);
      expect(client.messagesUl.html()).to.contain('my message');
      done();
    });
  });

  it('should send messages from the message box', () => {
    client.inputBox.val('some message');
    sinon.stub(client.socket, 'emit');

    client.form.submit();

    expect(client.socket.emit.called).to.be.true;
    client.socket.emit.restore();
  });
});
