// Entry point for webpacked client code.
const $ = require('jquery');
const io = require('socket.io-client');
const _ = require('underscore');

import settings from '../settings';
import consts from './consts';

class Client {

  constructor() {
    this.socket = io.connect(`http://${settings.host}:${settings.port}`);
    _.bindAll(this, 'handleSubmit');
  }

  render() {
    this.el = $(`
      <div>
        <ul class='messages'></ul>
        <form action="">
          <input class='input-box' autocomplete="off" /><button>Send</button>
        </form>
      </div>
    `);
    this.inputBox = this.el.find('.input-box');
    this.messagesUl = this.el.find('.messages');
    this.form = this.el.find('form');
  }

  registerHandlers() {
    this.socket.on('connect', () => {
      this.form.submit(this.handleSubmit);
    });
  }

  handleSubmit() {
    this.socket.emit(consts.EVENT_USER_SEND_CHAT, this.inputBox.val());
    this.inputBox.val('');
    return false;
  }
}

function addNews(msg) {
  $('<li>').addClass('news').text(msg).appendTo('#messages');
}

// #m: input box
function handleConnect() {
  $('form').submit(() => {
    this.emit(consts.EVENT_USER_SEND_CHAT, $('#m').val());
    $('#m').val('');
    return false;
  });
}

function handleDisconnect() {
  addNews('The server has disconnected.');
  $('form').off('submit');
}

function start() {
  var socket = io.connect(`http://${settings.host}:${settings.port}`);
  socket.on('news', (data) => {
    addNews(data.message);
  });

  socket.on(consts.EVENT_USER_RECV_CHAT, (data) => {
    console.log(data.message);
    $('<li>').text(`${data.name}: ${data.message}`).appendTo('#messages');
  });

  socket.on('disconnect', handleDisconnect);

  socket.on('connect', handleConnect);
  return socket;
}

exports.addNews = addNews;
exports.start = start;
exports.handleConnect = handleConnect;
