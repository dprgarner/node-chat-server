const roles = {
  test: {
    host: process.env.HOSTNAME || 'localhost',
    port: 9999,
  },

  development: {
    host: process.env.HOSTNAME || 'localhost',
    port: 54321,
  },
};

module.exports = roles[process.env.NODE_ENV];