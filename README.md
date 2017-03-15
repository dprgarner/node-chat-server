Chat server
===========

Boilerplate app for setting up a websocket-based chat server with JavaScript. Currently set up with a very simple Express app and Webpack bundle.

TODO
----

- Write tests
  - Read up on websocket testing
  - Maybe socket.io have a testing framework? If not, use sinon for unit tests.
  - Might be fun to go straight into functional testing.

- Set a session cookie to store the username
- Keep the username when the server restarts
- Limit to one person per username (except for anonymous - or set a uuid)
- Slight styling fixes
  - Scroll down when messages take up the whole page
  - Don't have the chat box overlay the page
- "User is typing" message
- Channels
- Giphy
- Error messaging if a message isn't delivered
- Store messages?
- Private messaging?

Getting started
---------------

To install the packages:
```
npm install
```
To bundle the code and start the server:
```
npm start
```
To start the server in watch mode, which will rebundle and restart on any changes to any of the JavaScript files:
```
npm run watch
```

Resources
---------

- socket.io is finally back online. https://socket.io/
- An archive.org link to the chat tutorial: https://web.archive.org/web/20161018172034/http://socket.io/get-started/chat/
- A mirror of the documentation: http://devdocs.io/socketio/using-multiple-nodes
- A tutorial: https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time
- Cheat sheet: https://github.com/socketio/socket.io/blob/master/docs/emit.md
- Testing socket.io with mocha http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/
