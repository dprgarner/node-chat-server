// Entry point for webpacked client code.
import $ from 'jquery';
import _ from 'underscore';
import consts from './consts';
import io from 'socket.io-client';
import settings from '../settings';

const handlePrefix = 'handle_';

export class Client {

  constructor() {
    this.socket = null;

    // Bind all handle functions.
    _.bindAll.apply(_, [this, ...this.getHandleFuncs()]);

    _.bindAll(this, 'onSubmit');
  }

  start() {
    this.socket = io.connect(`http://${settings.host}:${settings.port}`);
    this.render();
    this.registerSocketHandlers();
    return this;
  }

  render() {
    this.el = $(`
      <div>
        <ul class='messages'></ul>
        <form>
          <input class='input-box' autocomplete='off'/>
        </form>
      </div>
    `);
    this.inputBox = this.el.find('.input-box');
    this.messagesUl = this.el.find('.messages');
    this.form = this.el.find('form');
  }

  getHandleFuncs() {
    const funcs = Object.getOwnPropertyNames(Client.prototype);
    return _.filter(funcs, x => x.indexOf(handlePrefix) === 0);
  }

  registerSocketHandlers() {
    _.each(this.getHandleFuncs(), funcName => {
      const eventName = funcName.substring(handlePrefix.length);
      this.socket.on(eventName, this[funcName]);
    })
  }

  [handlePrefix + 'connect'](data) {
    this.form.submit(this.onSubmit);
  }

  [handlePrefix + 'disconnect'](data) {
    this.addNews('The server has disconnected.');
    this.form.off('submit');
  }

  [handlePrefix + consts.EVENT_NEWS](data) {
    this.addNews(data.message);
    this.scrollToBottom();
  }

  [handlePrefix + consts.EVENT_USER_RECV_CHAT](data) {
    $('<li>').text(`${data.name}: ${data.message}`).appendTo(this.messagesUl);
    this.scrollToBottom();
  }

  onSubmit() {
    this.socket.emit(consts.EVENT_USER_SEND_CHAT, this.inputBox.val());
    this.inputBox.val('');
    return false;
  }

  scrollToBottom() {
    this.messagesUl.scrollTop(this.messagesUl[0].scrollHeight);
  }

  addNews(msg) {
    $('<li>').addClass('news').text(msg).appendTo(this.messagesUl);
  }
}
