var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
      './src/renderer/entry.jsx'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
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
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      hot: true,
      template: 'src/renderer/index.html',
      inject: 'body'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.ProvidePlugin({
        Radium: 'radium',
        "jQuery":'jquery',
        "$":'jquery',
        "_": 'lodash',
    })
  ]
};
