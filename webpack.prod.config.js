/* eslint no-var: 0 */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
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
      './vendor/renderer/lato/latofonts.css',
      './vendor/renderer/semantic-ui/semantic.js',
      './vendor/renderer/semantic-ui/semantic.css',
    ],
  },
  output: {
    path: path.join(__dirname, 'out', 'static'),
    filename: '[name].bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|vendor)/,
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
    noParse: [/(html2canvas|jointjs)/],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendorCommon', 'vendorCommonReact', 'vendorSemanticUI'],
      filename: 'vendor-common.bundle.js',
      minChunks: Infinity,
    }),
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    // new BundleAnalyzerPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
};
