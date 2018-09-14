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

// Custom joint shape representing table/view object
joint.shapes.sqlectron = {};
joint.shapes.sqlectron.Table = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: 'sqlectron.Table',
    attrs: {
      rect: { stroke: 'none', 'fill-opacity': 0 },
    },
  }, joint.shapes.basic.Rect.prototype.defaults),
});

joint.shapes.sqlectron.TableView = joint.dia.ElementView.extend({
  template: '<div class="sqlectron-table"><p><span></span></p></div>',

  initialize(...args) {
    bindAll(this, 'updateBox');
    joint.dia.ElementView.prototype.initialize.apply(this, args);
    this.$box = $(template(this.template)());

    this.$box.find('span').text(this.model.get('name'));
    this.$box.addClass(this.model.get('name'));

    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this);

    this.updateBox();
  },
  render(...args) {
    joint.dia.ElementView.prototype.render.apply(this, args);
    this.paper.$el.prepend(this.$box);
    return this;
  },
  updateBox() {
    // Set the position and dimension of the box so that it covers the JointJS element.
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
