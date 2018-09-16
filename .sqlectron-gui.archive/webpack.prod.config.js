const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// require('babel-polyfill');

module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  target: 'electron-renderer',
  resolve: {
    extensions: ['*', '.js', '.jsx'],
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
        exclude: /[\\/](node_modules|vendor)[\\/]/,
        use: [
          { loader: 'babel-loader' },
          // 'css-loader'
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          { loader: MiniCssExtractPlugin.loader },
          // 'style-loader',
          'css-loader',
          // { loader: 'css-loader', options: { importLoaders: 1 } },
          // { loader: 'postcss-loader', options: { exec: true } },
          // 'sass-loader',
        ]
        /*use: ExtractTextPlugin.extract(
          {
            fallback: 'style',
            //use: 'css!sass',
            use: 'autoprefixer?browsers=last 2 version'
          }
        ),*/
      },
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ],
      },
      {
        test: /\.gif$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/gif'
            }
          }
        ],
      },
      {
        test: /\.(?:eot|ttf|woff2?|svg)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash:6].[ext]'
          }
        }
        ],
      }
    ],
    noParse: [
      /(html2canvas)/
    ],
  },

  plugins: [
    // new ExtractTextPlugin('[name].bundle.css'),
    new MiniCssExtractPlugin({filename: '[name].bundle.css'}),
    //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity }),
    // new webpack.optimize.CommonsChunkPlugin({ name: 'common' }),
    new HtmlWebpackPlugin({
      template: 'src/renderer/index.html',
      chunksSortMode: 'none',
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),
    // new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') }),
    // new BundleAnalyzerPlugin(),
    // new webpack.NoErrorsPlugin()
  ],

  optimization: {
    minimize: true,
    runtimeChunk: {
      name: 'common'
    },
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};
