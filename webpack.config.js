const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProd = process.env.NODE_ENV === 'production';

const webpackConfig = {
  mode: isProd ? 'production' : 'development',
  devtool: 'eval-source-map',
  target: 'web',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', 'src/renderer'],
  },
  entry: {},
  output: {},
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: { configFile: 'tsconfig.build.json' },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|vendor)/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.s?css$/,
        use: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
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
              name: isProd ? 'fonts/[name]-[hash:6].[ext]' : '[path][name]-[hash:6].[ext]',
              context: isProd ? 'context' : 'assets',
            },
          },
        ],
      },
    ],
    noParse: [/(html2canvas)/],
  },
  plugins: [
    new HtmlWebpackPlugin({
      hot: !isProd,
      template: 'src/renderer/index.html',
      chunksSortMode: isProd ? 'none' : 'auto',
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProd ? 'production' : 'development'),
    }),
    // new BundleAnalyzerPlugin()
    new webpack.LoaderOptionsPlugin({
      debug: !isProd,
      options: {
        postcss: [autoprefixer()],
      },
    }),
  ],
};

if (isProd) {
  webpackConfig.entry = {
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
    app: './src/renderer/entry.tsx',
  };

  webpackConfig.output = {
    path: path.join(__dirname, 'out', 'static'),
    filename: '[name].bundle.js',
  };

  webpackConfig.plugins.push(new MiniCssExtractPlugin({ filename: '[name].bundle.css' }));

  webpackConfig.optimization = {
    minimize: true,
  };
} else {
  webpackConfig.resolve.alias = {
    'dtrace-provider': path.join(__dirname, 'empty-shim.js'),
  };

  webpackConfig.entry.app = ['webpack/hot/dev-server', './src/renderer/entry.tsx'];

  webpackConfig.output = {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/',
  };

  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = webpackConfig;
