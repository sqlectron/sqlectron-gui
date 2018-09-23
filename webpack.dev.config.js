const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const { resolve, join } = require('path');
// const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const StyleLintPlugin = require('stylelint-webpack-plugin');
// const vars = require('./vars');

const ROOT_DIR = resolve(__dirname);

// const dependenciesWithoutEntryPoints = Object.keys(vars.dependencies || {}).filter(vars.filterDepWithoutEntryPoints);

const HOT_RELOAD_PORT = 8080;
const SRC_DIR = 'src';  // vars.ENABLE_TYPESCRIPT ? vars.TS_SRC : vars.JS_SRC;


const common = {
  context: ROOT_DIR,
  target: 'electron-renderer',
  mode: 'development',
  // devtool: 'cheap-module-eval-source-map',
  devtool: 'source-map',
  // https://github.com/webpack/webpack/issues/2010
  node: {
    __dirname: false,
    __filename: false
  },

  /*externals: {
    ...dependenciesWithoutEntryPoints,
    electron: 'require("electron")',
    child_process: 'require("child_process")',
    fs: 'require("fs")',
    path: 'require("path")'
  },*/

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules'
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [
          /vendor\//,
          /node_modules/
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
      /*
      {
        test: /\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              mimetype: 'image/png'
            }
          }
        ]
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
        ]
      }
      */
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
    // '@babel/polyfill',
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

module.exports = common;
