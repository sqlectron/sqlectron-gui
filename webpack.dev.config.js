const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('@babel/polyfill');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', 'src/renderer'],
    alias: {
      'dtrace-provider': path.join(__dirname, 'empty-shim.js'),
    },
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
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|vendor)/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')],
              },
            },
          },
        ],
      },
      {
        test: /\.png$/,
        use: [{ loader: 'url-loader', options: { mimetype: 'image/png' } }],
      },
      {
        test: /\.gif$/,
        use: [{ loader: 'url-loader', options: { mimetype: 'image/gif' } }],
      },
      {
        test: /\.(?:eot|ttf|woff2?|svg)$/,
        use: [{ loader: 'file-loader', options: { name: '[path][name]-[hash:6].[ext]', context: 'assets' } }],
      },
    ],
    noParse: [/html2canvas/],
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
      jQuery: 'jquery',
      $: 'jquery',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        postcss: [
          autoprefixer(),
        ],
      },
    }),
  ],
};
