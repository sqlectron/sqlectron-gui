import joint from 'jointjs/dist/joint';
import { bindAll, template } from 'lodash';


joint.shapes.sqlectron.TableCell = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: 'sqlectron.TableCell',
    attrs: {
      rect: { stroke: 'none', 'fill-opacity': 0, style: { 'pointer-events': 'none' } },
    },
  }, joint.shapes.basic.Rect.prototype.defaults ),
});

joint.shapes.sqlectron.TableCellView = joint.dia.ElementView.extend({
  template: `<div class="sqlectron-table-cell"><span style="white-space:nowrap;"></span></div>`,

  initialize: function() {
    bindAll(this, 'updateCell');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
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
  render: function() {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.paper.$el.prepend(this.$box);
    return this;
  },
  updateCell: function() {
    const bbox = this.model.getBBox();
    this.$box.css({
      width: bbox.width,
      height: bbox.height,
      left: bbox.x,
      top: bbox.y,
      transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)',
    });
  },
});
