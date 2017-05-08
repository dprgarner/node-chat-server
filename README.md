Chat server
===========

Boilerplate app for setting up a websocket-based chat server with JavaScript. Currently set up with a very simple Express app and Webpack bundle.

TODO
----

- New Features to add in the next few sessions
  - "User has disconnected" message
  - "User is typing" message
  - Recall (delete) one of your messages
  - Edit one of your messages
  - List users (first with a /list command, then with a side-bar on the page)

- New Features to add later on, if we get around to it
  - Limit to one person per username (except for anonymous - or set a uuid)
  - Keep the username when the server restarts
  - Add Giphy
  - Remove Giphy
  - Only add Gifs that Rob hates
  - Error messaging if a message isn't delivered
  - Store messages?
  - Channels?
  - Private messaging?

- Unit test and initial code refactoring (if we get around to it):
  - Extract 'Anonymous' into a global variable
  - Refactor the server tests to be more unit-like
  - Make sure that the client-side tests cover all logic (e.g. scroll handling, message appending)

- Functional tests:
  - Find a way to start and stop a full test server.
  - Check that the wdio client connects, browses, and disconnects.

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

- The socket.io site is finally back online. https://socket.io/
- An archive.org link to the chat tutorial: https://web.archive.org/web/20161018172034/http://socket.io/get-started/chat/
- A mirror of the documentation: http://devdocs.io/socketio/using-multiple-nodes
- A tutorial: https://openclassrooms.com/courses/ultra-fast-applications-using-node-js/socket-io-let-s-go-to-real-time
- Cheat sheet: https://github.com/socketio/socket.io/blob/master/docs/emit.md
- Testing socket.io with mocha http://liamkaufman.com/blog/2012/01/28/testing-socketio-with-mocha-should-and-socketio-client/
