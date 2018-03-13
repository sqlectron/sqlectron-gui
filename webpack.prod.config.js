const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('babel-polyfill');

module.exports = {
  devtool: 'eval-source-map',
  target: 'electron-renderer',
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src/renderer'],
  },
  entry: {
    app: './src/renderer/entry.jsx',
    vendor: [
      // common
      'jquery',
      // react related
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
      // semantic ui
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
        loader: ExtractTextPlugin.extract(
          'style',
          'css!sass',
          'autoprefixer?browsers=last 2 version',
          'sass?includePaths[]=' + path.resolve(__dirname, 'node_modules')
        ),
      },
      {
        test: /\.png$/,
        loader: 'url?mimetype=image/png',
      },
      {
        test: /\.gif$/,
        loader: 'url?mimetype=image/gif',
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
    noParse: [/(html2canvas)/],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].bundle.css'),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
      chunksSortMode: 'none',
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
