const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require('@babel/polyfill');

module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  target: 'electron-renderer',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: ['node_modules', 'src/renderer'],
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
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|vendor)/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.resolve(__dirname, 'node_modules')],
              },
            },
          },
          'postcss-loader',
          /*
          loader: MiniCssExtractPlugin.loader,
          options: {
            // 'style',
            // 'css!sass',
            autoprefixer: {
              browsers: [
                'last 2 version',
              ],
            },
          },
          */
          // 'autoprefixer?browsers=last 2 version',
          // 'sass?includePaths[]=' + path.resolve(__dirname, 'node_modules'),
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png',
            },
          },
        ],
      },
      {
        test: /\.gif$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/gif',
            },
          },
        ],
      },
      {
        test: /\.(?:eot|ttf|woff|woff2|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name]-[hash:6].[ext]',
            },
          },
        ],
      },
    ],
    noParse: [/(html2canvas)/],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
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
    // new BundleAnalyzerPlugin()
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: [
          autoprefixer(),
        ],
      },
    }),
  ],
  optimization: {
    minimize: true,
  },
};
