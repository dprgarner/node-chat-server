const fs = require('fs');

const dateformat = require('dateformat');

exports.config = {
    // Specify Test Files
    specs: [
        './test/functional/*.js'
    ],

    // Patterns to exclude.
    exclude: [],

    maxInstances: 1,

    capabilities: [{
        maxInstances: 1,
        browserName: 'phantomjs'
    }],

    // By default WebdriverIO commands are executed in a synchronous way using
    // the wdio-sync package. If you still want to run your tests in an async way
    // e.g. using promises you can set the sync option to false.
    sync: true,

    // Level of logging verbosity: silent | verbose | command | data | result | error
    logLevel: 'error',

    // Enables colors for log output.
    coloredLogs: true,

    // Saves a screenshot to a given path if a command fails.
    screenshotPath: './test/screenshots/',

    host: process.env.HOSTNAME || '127.0.0.1',

    // Set a base URL in order to shorten url command calls. If your url parameter starts
    // with "/", then the base url gets prepended.
    // baseUrl: 'http://localhost',

    // Default timeout for all waitFor* commands.
    waitforTimeout: 10000,

    // Default timeout in milliseconds for request
    // if Selenium Grid doesn't send response.
    connectionRetryTimeout: 90000,

    // Default request retries count
    connectionRetryCount: 3,

    // Test runner services
    // Services take over a specific job you don't want to take care of. They enhance
    // your test setup with almost no effort. Unlike plugins, they don't add new
    // commands. Instead, they hook themselves up into the test process.
    services: ['phantomjs'],

    // Framework you want to run your specs with.
    // The following are supported: Mocha, Jasmine, and Cucumber
    // see also: http://webdriver.io/guide/testrunner/frameworks.html
    framework: 'mocha',

    // Test reporter for stdout. The only one supported by default is 'dot'
    // See also: http://webdriver.io/guide/testrunner/reporters.html
    reporters: ['spec'],

    // Options to be passed to Mocha.
    // See the full list at http://mochajs.org/
    mochaOpts: {
        ui: 'bdd'
    },

    // =====
    // Hooks
    // =====
    // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
    // it and to build services around it. You can either apply a single function or an array of
    // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
    // resolved to continue.

    // Gets executed once before all workers get launched.
    // onPrepare: function (config, capabilities) {
    // },

    // Gets executed just before initialising the webdriver session and test framework. It allows you
    // to manipulate configurations depending on the capability or spec.
    // beforeSession: function (config, capabilities, specs) {
    // },

    // Gets executed before test execution begins. At this point you can access all global
    // variables, such as `browser`. It is the perfect place to define custom commands.
    // before: function (capabilities, specs) {
    // },

    // Hook that gets executed before the suite starts
    // beforeSuite: function (suite) {
    // },

    // Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
    // beforeEach in Mocha)
    // beforeHook: function () {
    // },

    // Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
    // afterEach in Mocha)
    // afterHook: function () {
    // },

    // Function to be executed before a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    // beforeTest: function (test) {
    // },

    // Runs before a WebdriverIO command gets executed.
    // beforeCommand: function (commandName, args) {
    // },

    // Runs after a WebdriverIO command gets executed
    // afterCommand: function (commandName, args, result, error) {
    // },

    // Function to be executed after a test (in Mocha/Jasmine) or a step (in Cucumber) starts.
    afterTest: function (test) {
        if (!test.passed) {
            var screenshotLocation =
                this.screenshotPath
                + dateformat(new Date(), 'yy-mm-dd__HH-MM__')
                + (test.fullTitle).replace(/\s/g, '-')
                + '.png';
            browser.saveScreenshot(screenshotLocation)
            console.log('Saved error screenshot: ' + screenshotLocation);
        }
    },

    // Hook that gets executed after the suite has ended
    // afterSuite: function (suite) {
    // },

    // Gets executed after all tests are done. You still have access to all global variables from
    // the test.
    // after: function (result, capabilities, specs) {
    // },

    // Gets executed right after terminating the webdriver session.
    // afterSession: function (config, capabilities, specs) {
    // },

    // Gets executed after all workers got shut down and the process is about to exit. It is not
    // possible to defer the end of the process using a promise.
    // onComplete: function(exitCode) {
    // }
};

if (!fs.existsSync(exports.config.screenshotPath)) {
    fs.mkdirSync(exports.config.screenshotPath);
};
