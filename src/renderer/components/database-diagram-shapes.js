import * as joint from 'jointjs';
import { bindAll, template } from 'lodash';

// Custom joint shape representing table/view object
const SqlectronShapes = {};

// Custom joint shape representing table/view object
SqlectronShapes.Table = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement(
    {
      type: 'sqlectron.Table',
      attrs: {
        rect: { stroke: 'none', 'fill-opacity': 0, fill: 'red' },
      },
    },
    joint.shapes.basic.Rect.prototype.defaults,
  ),
});

SqlectronShapes.TableView = joint.dia.ElementView.extend({
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

SqlectronShapes.TableCell = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement(
    {
      type: 'sqlectron.TableCell',
      attrs: {
        rect: { stroke: 'none', 'fill-opacity': 0, style: { 'pointer-events': 'none' } },
      },
    },
    joint.shapes.basic.Rect.prototype.defaults,
  ),
});

SqlectronShapes.TableCellView = joint.dia.ElementView.extend({
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

const cellNamespace = { sqlectron: SqlectronShapes };

export { joint, SqlectronShapes, cellNamespace };
