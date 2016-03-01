const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'eval',
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
};
