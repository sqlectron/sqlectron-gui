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
const webpack = require('webpack');
const { resolve, join } = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');
const StyleLintPlugin = require('stylelint-webpack-plugin');

const ENABLE_TYPESCRIPT = false;
const ROOT_DIR = resolve(join(__dirname, '../..'));
const JS_SRC = './src';
const TS_SRC = './typescriptrewritesrc';

module.exports = {
  context: ROOT_DIR,
  target: 'electron-renderer',
  /*
  externals: {
    electron: 'require("electron")',
    child_process: 'require("child_process")',
    fs: 'require("fs")',
    path: 'require("path")'
  },
  */
  resolve: {
    extensions: ['.js', '.jsx'].concat(['.ts', '.tsx']),
    modules: [
      'node_modules',
      join(ENABLE_TYPESCRIPT ? TS_SRC : JS_SRC, 'renderer')
    ]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: RegExp('node_modules|vendor|' + (
          ENABLE_TYPESCRIPT ? JS_SRC : TS_SRC
        )),
        use: [
          'babel-loader',
          'source-map-loader'
        ]
      },
      ENABLE_TYPESCRIPT ? {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          'awesome-typescript-loader'
        ],
      } : {},
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
    ],
    noParse: [ /html2canvas/ ]
  },
  plugins: (ENABLE_TYPESCRIPT ? [ new CheckerPlugin() ] : []).concat([
    // '@babel/polyfill',
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new StyleLintPlugin(),
  ])
};
