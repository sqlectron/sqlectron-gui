const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const ROOT_DIR = resolve(__dirname);
const SRC_DIR = 'src';
const OPEN_ANALYZER = true;

module.exports = {
  context: ROOT_DIR,
  target: 'electron-renderer',
  mode: 'production',
  devtool: 'eval-source-map',
  node: {  // https://github.com/webpack/webpack/issues/2010
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
      join(SRC_DIR, 'vendor')
    ],
    alias: {
      'dtrace-provider': './empty-shim.js',
      // 'lodash': 'lodash-es',
      //
      // 'lodash._basetostring': 'lodash-es/_baseToString',
      // 'lodash._basevalues': 'lodash-es/_baseValues',
      // 'lodash._getnative': 'lodash-es/_getNative',
      // 'lodash._isiterateecall': 'lodash-es/_isIterateeCall',
      // 'lodash._reescape': 'lodash-es/_reEscape',
      // 'lodash._reevaluate': 'lodash-es/_reEvaluate',
      // 'lodash._reinterpolate': 'lodash-es/_reInterpolate',
      // 'lodash._root': 'lodash-es/_root',
      //
      // 'lodash.assign': 'lodash-es/assign',
      // 'lodash.camelcase': 'lodash-es/camelCase',
      // 'lodash.clonedeep': 'lodash-es/cloneDeep',
      // 'lodash.debounce': 'lodash-es/debounce',
      // 'lodash.escape': 'lodash-es/escape',
      // 'lodash.get': 'lodash-es/get',
      // 'lodash.isarguments': 'lodash-es/isArguments',
      // 'lodash.isarray': 'lodash-es/isArray',
      // 'lodash.isequal': 'lodash-es/isEqual',
      // 'lodash.keys': 'lodash-es/keys',
      // 'lodash.mergewith': 'lodash-es/mergeWith',
      // 'lodash.tail': 'lodash-es/tail',
      // 'lodash.template': 'lodash-es/template',
      // 'lodash.templateSettings': 'lodash-es/templateSettings'
    }
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          /[\\/]vendor[\\/]/,
          /[\\/]node_modules[\\/]/
        ],
        use: [
          {
            loader: 'babel-loader',
            options: {
              compact: true
            }
          },
          'source-map-loader'
        ]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'img/[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              query: {
                gifsicle: {
                  interlaced: false
                },
                mozjpeg: {
                  progressive: true
                },
                optipng: {
                  optimizationLevel: 7
                }
              }
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                /[\\/]node_modules[\\/]/
              ]
            }
          }
        ]
      },
      {
        test: /\.(?:eot|ttf|woff2?|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name]-[hash:6].[ext]'
            }
          }
        ]
      }
    ],
    noParse: [ /html2canvas/ ]
  },
  entry: {
    app: `./${SRC_DIR}/renderer/entry.jsx`,
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
      'react-router-dom',
      'react-select',
      'redux',
      'redux-thunk',
      // semantic ui
      './vendor/renderer/lato/latofonts.css',
      './vendor/renderer/semantic-ui/semantic.js',
      './vendor/renderer/semantic-ui/semantic.css'
    ]
  },
  output: {
    path: join(ROOT_DIR, 'out', 'static'),
    filename: '[name].bundle.js'
  },
  plugins: [
    // READ: https://nolanlawson.com/2018/03/20/smaller-lodash-bundles-with-webpack-and-babel/
    // new LodashModuleReplacementPlugin,
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new StyleLintPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
    new HtmlWebpackPlugin({
      template: `./${SRC_DIR}/renderer/index.html`,
      chunksSortMode: 'none',
      minify: true
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: OPEN_ANALYZER ? 'server' : 'disabled',
      openAnalyzer: OPEN_ANALYZER
    }),
  ],
  performance: {
    hints: 'warning',
    maxEntrypointSize: 250000,
    maxAssetSize: 250000
  },
  optimization: {
    minimize: true,
    runtimeChunk: {
      name: 'common'
    },
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};
