/* eslint no-var: 0 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
require('babel-polyfill');

module.exports = {
  debug: true,
  devtool: 'eval-source-map',
  target: 'electron',
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src/renderer'],
  },
  entry: {
    app: [
      'webpack/hot/dev-server',
      './src/renderer/entry.jsx',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|src\/renderer\/vendor)/,
        loaders: ['babel'],
      },
      {
        test: /\.s?css$/,
        loaders: [
          'style',
          'css',
          'autoprefixer?browsers=last 2 version',
          'sass?includePaths[]=' + path.resolve(__dirname, 'node_modules'),
        ],
      },
      {
        test: /\.png$/,
        loader: 'url?mimetype=image/png',
      },
      {
        test: /\.(?:eot|ttf|woff2?|svg)$/,
        loader: 'file?name=[path][name]-[hash:6].[ext]&context=assets',
      },
      {
        test: /\.json?$/,
        loader: 'json',
      },
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      hot: true,
      template: 'src/renderer/index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
    new webpack.ProvidePlugin({
      Radium: 'radium',
      'jQuery': 'jquery',
      '$': 'jquery',
      '_': 'lodash',
    }),
  ],
};
