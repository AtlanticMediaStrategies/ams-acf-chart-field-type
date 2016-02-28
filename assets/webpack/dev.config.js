const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://local.allstate.com:8080',
    './assets/src/index.js',
  ],
  output: {
    publicPath: 'http://local.allstate.com:8080/assets/dist/',
    path: path.resolve('./assets/dist'),
    file: "bundle.js",
  },

  module: {
    loaders: [{
      test: /\.scss$/,
      loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
    }],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
      __DEVELOPMENT__: true,
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
