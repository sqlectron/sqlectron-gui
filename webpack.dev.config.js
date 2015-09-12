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
        loaders: ['babel-loader?stage=0&optional=runtime']
      },
      {
        test: /\.less$/,
        loader: 'style-loader!css-loader!autoprefixer-loader?{browsers:["last 2 version"]}!less-loader'
      },
      {
        test: /\.(?:eot|ttf|woff2?)$/,
        loader: 'file-loader?name=[path][name]-[hash:6].[ext]&context=assets'
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$")),
    new webpack.ProvidePlugin({
        Radium: 'radium',
        "_": 'lodash',
    })
  ],
  devtool: 'eval-source-map',
  target: 'atom'
};
