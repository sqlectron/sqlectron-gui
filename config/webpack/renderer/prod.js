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
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const commonConfig = require('./common');

const ENABLE_TYPESCRIPT = false;
const JS_SRC = './src';
const TS_SRC = './typescriptrewritesrc';
const ROOT_DIR = resolve(join(__dirname, '../..'));
const cssLoaders = [
  MiniCssExtractPlugin.loader,
  // 'style-loader',
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
    mode: 'production',
    // devtool: 'source-map',
    // devtool: 'eval',
    devtool: 'cheap-module-source-map',
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
                name: 'fonts/[name]-[hash:6].[ext]'
              }
            }
          ]
        }
      ]
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
        './vendor/renderer/semantic-ui/semantic.css'
      ]
    },
    output: {
      path: join(ROOT_DIR, 'out', 'static'),
      filename: '[name].bundle.js'
    },
    plugins: [
      new webpack.optimize.OccurrenceOrderPlugin(true),
      new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
      new HtmlWebpackPlugin({
        template: './src/renderer/index.html',
        chunksSortMode: 'none',
        minify: true
      }),
      // new BundleAnalyzerPlugin(),
    ],
    resolve: {
      alias: {
        'dtrace-provider': './empty-shim.js'
      }
    },
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
            /*
            test: RegExp('node_modules|' + (
              ENABLE_TYPESCRIPT ? TS_SRC : JS_SRC
            )),
            */
            name: 'vendor',
            chunks: 'all'
          }
        }
      }
    }
  }
);
