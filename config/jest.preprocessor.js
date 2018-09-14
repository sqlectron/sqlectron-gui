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
const tsc       = require('typescript');
const tsConfig  = require('./../tsconfig.json');

module.exports = {
    process(src, path) {
        const isTs             = path.endsWith('.ts');
        const isTsx            = path.endsWith('.tsx');
        const isTypescriptFile = (isTs || isTsx);

        if ( isTypescriptFile ) {
            src = tsc.transpileModule(
                src,
                {
                    compilerOptions: tsConfig.compilerOptions,
                    fileName:        path
                }
            ).outputText;

            // update the path so babel can try and process the output
            path = path.substr(0, path.lastIndexOf('.')) + (isTs ? '.js' : '.jsx') || path;
        }

        return src;
    },
};
