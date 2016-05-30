import joint from 'jointjs';


joint.shapes.sqlectron.tableCell = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: 'sqlectron.tableCell',
    attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0, style: { 'pointer-events':'none' } }
        }
  }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.sqlectron.tableCellView = joint.dia.ElementView.extend({
  template: `<div class="sqlectron-table-cell"><span></span></div>`,

  initialize: function() {
    _.bindAll(this, 'updateCell');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    this.$box = $(_.template(this.template)());
    this.model.on('change', this.updateCell, this);

    this.updateCell();
  },
  render: function() {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.paper.$el.prepend(this.$box);
    return this;
  },
  updateCell: function() {
    var bbox = this.model.getBBox();
    this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
    this.$box.find('span').text(this.model.get('name'));
  }
});
