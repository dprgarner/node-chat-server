const $ = require('jquery');
const expect = require('chai').expect;
const io = require('socket.io');

const client = require('./client.js')
const settings = require('./settings');

describe('client-side', () => {
  beforeEach(() => {
    $('body').append('<ul id="messages"/>');
  });

  afterEach(() => {
    $('body').empty();
  });

  describe('connections', () => {
    let server;
    let clientSocket;
    beforeEach(() => {
      server = io.listen(settings.port);
    });

    afterEach(done => {
      let clientDisconnected = false;
      let serverDisconnected = false;
      clientSocket.once('disconnect', () => {
        clientDisconnected = true;
        if (serverDisconnected) done();
      });
      server.close(() => {
        serverDisconnected = true;
        if (clientDisconnected) done();
      });
    });

    it('connects to the server', done => {
      clientSocket = client.start()
      server.once('connect', () => {
        done();
      });
    });
  });

  describe('addNews', () => {
    it('appends to the end of the messages list', () => {
      console.log($('body').html())
      expect($('#messages li')).to.have.length(0);
      client.addNews('hello world');
      expect($('#messages li')).to.have.length(1);
    });
  });
});
