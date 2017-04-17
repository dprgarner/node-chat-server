const webpack = require('webpack');

module.exports = {
  devtool: 'source-map',

  entry: './src/client-start.js',

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
