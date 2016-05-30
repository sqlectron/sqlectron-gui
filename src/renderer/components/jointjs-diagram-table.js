import joint from 'jointjs';


// Custom joint shape representing table/view object
joint.shapes.sqlectron = {};
joint.shapes.sqlectron.table = joint.shapes.basic.Rect.extend({
  defaults: joint.util.deepSupplement({
    type: 'sqlectron.table',
    attrs: {
            rect: { stroke: 'none', 'fill-opacity': 0 }
        }
  }, joint.shapes.basic.Rect.prototype.defaults)
});

joint.shapes.sqlectron.tableView = joint.dia.ElementView.extend({
  template: `<div class="sqlectron-table"><p></p></div>`,

  initialize: function() {
    _.bindAll(this, 'updateBox');
    joint.dia.ElementView.prototype.initialize.apply(this, arguments);
    this.$box = $(_.template(this.template)());
    // Update the box position whenever the underlying model changes.
    this.model.on('change', this.updateBox, this);

    this.updateBox();
  },
  render: function() {
    joint.dia.ElementView.prototype.render.apply(this, arguments);
    this.paper.$el.prepend(this.$box);
    return this;
  },
  updateBox: function() {
    // Set the position and dimension of the box so that it covers the JointJS element.
    var bbox = this.model.getBBox();
    this.$box.css({ width: bbox.width, height: bbox.height, left: bbox.x, top: bbox.y, transform: 'rotate(' + (this.model.get('angle') || 0) + 'deg)' });
    this.$box.find('p').text(this.model.get('name'));
  }
});
