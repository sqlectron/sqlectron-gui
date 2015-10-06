var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval-source-map',
  target: 'electron',
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src/renderer']
  },
  entry: {
    app: './src/renderer/entry.jsx'
  },
  output: {
    path: path.join(__dirname, 'build/static'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      {
        test: /\.css$/,
        loader: 'style!css!autoprefixer?{browsers:["last 2 version"]}'
      },
      {
        test: /\.png$/,
        loader: "url?mimetype=image/png"
      },
      {
        test: /\.(?:eot|ttf|woff2?|svg)$/,
        loader: 'file?name=[path][name]-[hash:6].[ext]&context=assets'
      },
      {
        test: /\.json?$/,
        loader: 'json'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
        Radium: 'radium',
        "jQuery":'jquery',
        "$":'jquery',
        "_": 'lodash',
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.NoErrorsPlugin()
  ]
};
