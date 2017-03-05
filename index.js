// Entry point for server code.
const express = require('express');

const PORT = 3000;

// Set up an Express app.
const app = express();

// Serve static files at the root path.
app.use('/', express.static('static'));

// Start the app.
app.listen(PORT, () => {
  console.log('Listening on port ' + PORT)
});
