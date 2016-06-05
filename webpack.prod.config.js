/* eslint no-var: 0 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
require('babel-polyfill');

module.exports = {
  devtool: 'eval-source-map',
  target: 'electron',
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src/renderer'],
  },
  entry: {
    app: './src/renderer/entry.jsx',
    vendorCommon: [
      'jquery',
      'lodash',
    ],
    vendorCommonReact: [
      'classnames',
      'react',
      'react-ace',
      'react-dom',
      'react-redux',
      'react-resizable',
      'react-router',
      'react-select',
      'redux',
      'redux-thunk',
    ],
    vendorSemanticUI: [
      './src/renderer/vendor/lato/latofonts.css',
      './src/renderer/vendor/semantic-ui/semantic.js',
      './src/renderer/vendor/semantic-ui/semantic.css',
    ],
  },
  output: {
    path: path.join(__dirname, 'app', 'out', 'static'),
    filename: '[name].bundle.js',
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
        loader: 'file?name=fonts/[name]-[hash:6].[ext]',
      },
      {
        test: /\.json?$/,
        loader: 'json',
      },
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorCommon',
      filename: 'vendor-common.bundle.js',
      children: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorCommonReact',
      filename: 'vendor-common-react.bundle.js',
      children: true,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendorSemanticUI',
      filename: 'vendor-semantic-ui.bundle.js',
      children: true,
    }),
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
    }),
    new webpack.ProvidePlugin({
      Radium: 'radium',
      'jQuery': 'jquery',
      '$': 'jquery',
      '_': 'lodash',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.NoErrorsPlugin(),
  ],
};
