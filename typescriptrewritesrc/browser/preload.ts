/**
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
/* eslint no-var: 0, prefer-arrow-callback:0 */
/**
 * Inject global configurations in the renderer process.
 *
 * Since it is loaded directly from the renderer process,
 * without passing through a transpiler, this file must use ES5.
 */

var config = require('./config');


process.once('loaded', function onLoaded() {
  global.SQLECTRON_CONFIG = config.get();
});

