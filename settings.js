const roles = {
  test: {
    host: process.env.HOSTNAME,
    port: 9999,
  },

  development: {
    host: process.env.HOSTNAME,
    port: 8080,
  },
};

module.exports = roles[process.env.NODE_ENV];
