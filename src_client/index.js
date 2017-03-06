// Entry point for webpacked client code.
document.write('Hello world!')

const $ = require('jquery');
const io = require('socket.io-client');

var socket = io.connect('http://dev-reports-app04.london.mintel.ad:8080');
socket.on('news', function (data) {
  console.log(data);
});

socket.on('connect', function () {
  console.log('Connected to server');
  $('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });
});
