const webpack = require('webpack');
const AnybarWebpackPlugin = require('anybar-webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

module.exports = {
  devtool: 'eval',
  output: {
    publicPath: 'http://local.allstate.com:8080/assets/dist/',
  },

  module: {
    loaders: [{
      test: /\.scss$/,
      loader: 'style!css?localIdentName=[path][name]--[local]!postcss-loader!sass',
    }],
  },
  plugins: [
    new AnybarWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
};
