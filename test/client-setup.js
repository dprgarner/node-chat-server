// This is a helper file which implements a lightweight server-side DOM for
// unit-testing client-side code in Node.

const jsdom = require('jsdom');

const document = jsdom.jsdom('<!doctype html><html><body></body></html>', {url: 'http://localhost/'});
global.document = document;
global.window = document.defaultView;
