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
import joint from 'jointjs/dist/joint';

//import bindAll from 'lodash.bindall';
//import template from 'lodash.template';
import _ from 'lodash';
const bindAll = _.bindAll;
const template = _.template;



joint.shapes.sqlectron.TableCell = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: 'sqlectron.TableCell',
    attrs: {
      rect: { stroke: 'none', 'fill-opacity': 0, style: { 'pointer-events': 'none' } },
    },
  }, joint.shapes.basic.Rect.prototype.defaults),
});

joint.shapes.sqlectron.TableCellView = joint.dia.ElementView.extend({
  template: '<div class="sqlectron-table-cell"><span style="white-space:nowrap;"></span></div>',

  initialize(...args) {
    bindAll(this, 'updateCell');
    joint.dia.ElementView.prototype.initialize.apply(this, args);
    this.$box = $(template(this.template)());

    const keyType = this.model.get('keyType');
    const keyColor = keyType === 'PRIMARY KEY' ? 'yellow' : '';
    const cellSpanEl = this.$box.find('span');

    cellSpanEl.text(this.model.get('name'));
    this.$box.addClass(this.model.get('tableName'));

    if (keyType) {
      cellSpanEl.prepend(`<i class="privacy icon ${keyColor}"></i>`);
    } else {
      cellSpanEl.css({
        paddingLeft: '1.18em',
        marginLeft: '0.25rem',
      });
    }

    this.model.on('change', this.updateCell, this);
    this.updateCell();
  },
  render(...args) {
    joint.dia.ElementView.prototype.render.apply(this, args);
    this.paper.$el.prepend(this.$box);
    return this;
  },
  updateCell() {
    const bbox = this.model.getBBox();
    this.$box.css({
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
      transform: `rotate(${this.model.get('angle') || 0}deg)`,
    });
  },
});
