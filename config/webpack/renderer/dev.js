/**
 * ============================================================================
 * Initial license from react-webpack-typescript-starter
 * https://github.com/vikpe/react-webpack-typescript-starter/tree/8feb05bec317a0441716949363884e154bbc4c0c
 * ============================================================================
 *
 * MIT License
 *
 * Copyright (c) 2017 Viktor Persson
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * ============================================================================
 * This file has been relicensed under the GPLv3.
 * ============================================================================
 *
 * GNU General Public License version 3
 *
 * unified-dataloader-gui
 * Copyright (C) 2018 Armarti Industries
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
// require('@babel/polyfill');
// require('@babel/register');
const merge = require('webpack-merge');
const webpack = require('webpack');
const { resolve, join } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonConfig = require('./common');

const ROOT_DIR = resolve(join(__dirname, '../..'));
const cssLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1
    }
  }
];

module.exports = merge(
  commonConfig,
  {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    // devtool: 'eval',
    module: {
      rules: [
        {
          test: /\.css$/,
          use: cssLoaders
        },
        {
          test: /\.scss$/,
          use: cssLoaders.concat({
            loader: 'sass-loader',
            options: {
              includePaths: [
                'node_modules'
              ]
            }
          })
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
      ]
    },
    entry: {
      app: [
        // activate HMR for React
        'react-hot-loader/patch',
        // bundle the client for webpack-dev-server and connect
        // to the provided endpoint
        'webpack-dev-server/client?http://localhost:8080',
        // bundle the client for hot reloading, only means to
        // only hot reload for successful updates
        'webpack/hot/only-dev-server',
        './src/renderer/entry.jsx'
      ]
    },
    output: {
      path: join(ROOT_DIR, 'dist'),
      filename: 'bundle.js',
      publicPath: '/static/'
    },
    devServer: {
      // enable HMR on the server
      hot: true
    },
    plugins: [
      // enable HMR globally
      new webpack.HotModuleReplacementPlugin(),
      new HtmlWebpackPlugin({
        hot: true,
        template: './src/renderer/index.html'
      })
    ],
    performance: {
      hints: 'warning'
    },
    optimization: {
      // prints more readable module names in the browser
      // console on HMR updates
      namedModules: true
    }
  }
);
