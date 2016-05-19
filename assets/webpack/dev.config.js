const webpack = require('webpack');
const AnybarWebpackPlugin = require('anybar-webpack');
const path = require('path');

module.exports = {
  devtool: 'eval',
  output: {
    publicPath: 'http://0.0.0.0:8080/assets/dist/',
  },

  module: {
    loaders: [{
      test: /\.scss$/,
      loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
    }],
  },
  plugins: [
    new AnybarWebpackPlugin()
  ]
};
