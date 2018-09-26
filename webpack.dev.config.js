const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');



const ROOT_DIR = resolve(__dirname);
const HOT_RELOAD_PORT = 8080;
const SRC_DIR = 'src';

module.exports = {
  context: ROOT_DIR,
  target: 'electron-renderer',
  mode: 'development',
  devtool: 'source-map',
  node: {  // https://github.com/webpack/webpack/issues/2010
    __dirname: false,
    __filename: false
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'

    ],
    // alias: {
    //
    //   'lodash': 'lodash-es',
    //
    //   'lodash._basetostring': 'lodash-es/_baseToString',
    //   'lodash._basevalues': 'lodash-es/_baseValues',
    //   'lodash._getnative': 'lodash-es/_getNative',
    //   'lodash._isiterateecall': 'lodash-es/_isIterateeCall',
    //   'lodash._reescape': 'lodash-es/_reEscape',
    //   'lodash._reevaluate': 'lodash-es/_reEvaluate',
    //   'lodash._reinterpolate': 'lodash-es/_reInterpolate',
    //   'lodash._root': 'lodash-es/_root',
    //
    //   'lodash.assign': 'lodash-es/assign',
    //   'lodash.camelcase': 'lodash-es/camelCase',
    //   'lodash.clonedeep': 'lodash-es/cloneDeep',
    //   'lodash.debounce': 'lodash-es/debounce',
    //   'lodash.escape': 'lodash-es/escape',
    //   'lodash.get': 'lodash-es/get',
    //   'lodash.isarguments': 'lodash-es/isArguments',
    //   'lodash.isarray': 'lodash-es/isArray',
    //   'lodash.isequal': 'lodash-es/isEqual',
    //   'lodash.keys': 'lodash-es/keys',
    //   'lodash.mergewith': 'lodash-es/mergeWith',
    //   'lodash.tail': 'lodash-es/tail',
    //   'lodash.template': 'lodash-es/template',
    //   'lodash.templateSettings': 'lodash-es/templateSettings'
    // }
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
              compact: false
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
        test: /\.s?css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                'node_modules'
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
              name: '[path][name]-[hash:6].[ext]',
              context: 'assets'
            }
          }
        ]
      }
    ],
    noParse: [ /html2canvas/ ]
  },
  entry: {
    app: [
      // activate HMR for React
      'react-hot-loader/patch',
      // bundle the client for webpack-dev-server and connect
      // to the provided endpoint
      `webpack-dev-server/client?http://localhost:${HOT_RELOAD_PORT}/`,
      // bundle the client for hot reloading, only means to
      // only hot reload for successful updates
      'webpack/hot/only-dev-server',
      `./${SRC_DIR}/renderer/entry.jsx`,
    ]
  },
  output: {
    path: join(ROOT_DIR, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  devServer: {
    // enable HMR on the server
    hot: true,
    port: HOT_RELOAD_PORT
  },
  performance: {
    hints: 'warning'
  },
  optimization: {
    // prints more readable module names in the browser
    // console on HMR updates
    namedModules: true
  },
  plugins: [
    // READ: https://nolanlawson.com/2018/03/20/smaller-lodash-bundles-with-webpack-and-babel/
    // new LodashModuleReplacementPlugin,
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new StyleLintPlugin(),
    new HtmlWebpackPlugin({
      hot: true,
      template: `${SRC_DIR}/renderer/index.html`,
      title: 'HtmlWebpackPlugin title - unified-dataloader-gui',
      useReactDevtools: true
    }),
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin()
  ]
};
