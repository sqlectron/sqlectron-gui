var path = require('path');
var webpack = require('webpack');

module.exports = {
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src'],
  },
  entry: {
    app: [
      'webpack/hot/dev-server',
      './src/entry.jsx' // Your appʼs entry point
    ]
  },
  output: {
    path: path.join(__dirname, '/public/built'),
    publicPath: 'http://localhost:8080/built/',
    filename: 'bundle.js',
  },
  devServer: {
    contentBase: path.join(__dirname, '/public'),
    publicPath: 'http://localhost:8080/built/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?stage=0&optional=runtime']
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
    new webpack.ProvidePlugin({
        Radium: 'radium',
        "jQuery":'jquery',
        "$":'jquery',
        "_": 'lodash',
    })
  ],
  devtool: 'eval-source-map',
  target: 'atom'
};
