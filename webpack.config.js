const webpack = require('webpack');

module.exports = {
  entry: './client.js',

  output: {
    filename: './static/bundle.js',
  },

  plugins: [
    // Replaces process.env.NODE_ENV in the webpacked code with the values on
    // the env, with the following default values.
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      HOSTNAME: 'localhost',
    }),
  ],
};
