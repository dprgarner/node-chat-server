const webpack = require('webpack');

module.exports = {
  entry: './src/client-start.js',

  output: {
    filename: './static/bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: /src\//,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
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
