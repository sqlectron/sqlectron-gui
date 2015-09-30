var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  debug: true,
  devtool: 'eval-source-map',
  target: 'atom',
  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: ['node_modules', 'src'],
  },
  entry: {
    app: [
      // 'eventsource-polyfill',
      // 'webpack-hot-middleware/client',
      'webpack/hot/dev-server',
      //
      // 'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
      // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors

      './src/entry.jsx'
    ]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
    // path: path.join(__dirname, '/dist'),
    // publicPath: '/dist/',
    // filename: 'bundle.js',
  },
  module: {
    // noParse: /socket\.io-client/,
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, 'src'),
        // exclude: /node_modules/,
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
    // new webpack.IgnorePlugin(new RegExp("^(webpack|fs|sqlectron-db|app|auto-updater|browser-window|content-tracing|dialog|global-shortcut|ipc|menu|menu-item|power-monitor|protocol|tray|remote|web-view|clipboard|crash-reporter|screen|shell)$")),
    // new webpack.ExternalsPlugin('commonjs', [
    //   'webpack',
    //   'sqlectron-db',
    //   'fs',
    //   'app',
    //   'auto-updater',
    //   'browser-window',
    //   'content-tracing',
    //   'dialog',
    //   'global-shortcut',
    //   'ipc',
    //   'menu',
    //   'menu-item',
    //   'power-monitor',
    //   'protocol',
    //   'tray',
    //   'remote',
    //   'web-view',
    //   'clipboard',
    //   'crash-reporter',
    //   'screen',
    //   'shell'
    // ]),
    new HtmlWebpackPlugin({
      hot: true,
      template: 'src/index.html',
      inject: 'body'
    }),
    new webpack.ProvidePlugin({
        Radium: 'radium',
        "jQuery":'jquery',
        "$":'jquery',
        "_": 'lodash',
    })
  ]
};
