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
// import webpack from 'webpack';
// import { join } from 'path';
// import { CheckerPlugin } from 'awesome-typescript-loader';
// import StyleLintPlugin from 'stylelint-webpack-plugin';
// import * as vars from './vars';

const webpack = require('webpack');
const join = require('path').join;
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const StyleLintPlugin = require('stylelint-webpack-plugin');
const vars = require('./vars');

const dependenciesWithoutEntryPoints = Object.keys(vars.dependencies || {}).filter(vars.filterDepWithoutEntryPoints);

const common = {
  context: vars.ROOT_DIR,
  target: 'electron-renderer',
  /*externals: {
    ...dependenciesWithoutEntryPoints,
    electron: 'require("electron")',
    child_process: 'require("child_process")',
    fs: 'require("fs")',
    path: 'require("path")'
  },*/

  // https://github.com/webpack/webpack/issues/2010
  node: {
    __dirname: false,
    __filename: false
  },

  resolve: {
    extensions: ['.js', '.jsx'].concat(vars.ENABLE_TYPESCRIPT ? ['.ts', '.tsx'] : []),
    modules: [
      'node_modules',
      join(vars.ENABLE_TYPESCRIPT ? vars.TS_SRC : vars.JS_SRC, 'renderer')
    ]
  },
  module: {
    rules: (vars.ENABLE_TYPESCRIPT ? [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          'awesome-typescript-loader'
        ],
      }] : []).concat([
      {
        test: /\.jsx?$/,
        exclude: RegExp('node_modules|vendor|' + (
          vars.ENABLE_TYPESCRIPT ? vars.JS_SRC : vars.TS_SRC
        )),
        use: [
          'babel-loader',
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
    ]),
    noParse: [ /html2canvas/ ]
  },
  plugins: (vars.ENABLE_TYPESCRIPT ? [ new CheckerPlugin() ] : []).concat([
    // '@babel/polyfill',
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new StyleLintPlugin()
  ])
};

module.exports = common;
