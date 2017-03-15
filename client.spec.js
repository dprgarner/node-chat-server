const $ = require('jquery');
const expect = require('chai').expect;
const io = require('socket.io');

const settings = require('./settings');

describe('client-side', () => {
  let server;

  beforeEach(() => {
    server = io.listen(settings.port);
    $('body').append('<div id="messages"/>');
  });

  afterEach(done => {
    $('body').empty();
    server.close(done);
  });

  it('connects to the server', done => {
    require('./client.js')
    server.once('connect', () => {
      done();
    });
  });
});
