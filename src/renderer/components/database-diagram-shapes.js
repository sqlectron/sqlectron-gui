import * as joint from 'jointjs';
import bindAll from 'lodash.bindall';
import template from 'lodash.template';

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

var Element = joint.dia.Element;
var ElementView = joint.dia.ElementView;

const HTMLShapes = {};

HTMLShapes.Element = Element.define(
  'html.Element',
  {
    size: { width: 250, height: 228 },
    fields: {
      header: 'Task',
      name: '',
      resource: '',
      state: '',
    },
    attrs: {
      placeholder: {
        refWidth: '100%',
        refHeight: '100%',
        fill: 'transparent',
        stroke: '#D4D4D4',
      },
    },
  },
  {
    markup: [
      {
        tagName: 'rect',
        selector: 'placeholder',
      },
    ],
    htmlMarkup: [
      {
        tagName: 'div',
        className: 'html-element',
        selector: 'htmlRoot',
        groupSelector: 'field',
        style: {
          position: 'absolute',
          'pointer-events': 'auto',
          'user-select': 'none',
          'box-sizing': 'border-box',
        },
        attributes: {
          'data-attribute': 'state',
        },
        children: [
          {
            tagName: 'label',
            className: 'html-element-header',
            groupSelector: 'field',
            attributes: {
              'data-attribute': 'header',
            },
          },
          {
            tagName: 'label',
            className: 'html-element-label',
            textContent: 'Name',
            children: [
              {
                tagName: 'input',
                className: 'html-element-field',
                groupSelector: 'field',
                attributes: {
                  'data-attribute': 'name',
                  placeholder: 'Name',
                },
                style: {
                  'pointer-events': 'auto',
                },
              },
            ],
          },
          {
            tagName: 'label',
            className: 'html-element-label',
            textContent: 'Resource',
            children: [
              {
                tagName: 'select',
                className: 'html-element-field',
                groupSelector: 'field',
                attributes: {
                  'data-attribute': 'resource',
                },
                style: {
                  'pointer-events': 'auto',
                },
                children: [
                  {
                    tagName: 'option',
                    textContent: 'Resource',
                    attributes: {
                      value: '',
                      disabled: 'true',
                    },
                  },
                  {
                    tagName: 'option',
                    textContent: 'John',
                    attributes: {
                      value: 'john',
                    },
                  },
                  {
                    tagName: 'option',
                    textContent: 'Mary',
                    attributes: {
                      value: 'mary',
                    },
                  },
                  {
                    tagName: 'option',
                    textContent: 'Bob',
                    attributes: {
                      value: 'bob',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
);

// Custom view for JointJS HTML element that displays an HTML <div></div> above the SVG Element.
HTMLShapes.ElementView = ElementView.extend({
  html: null,

  presentationAttributes: ElementView.addPresentationAttributes({
    position: ['HTML_UPDATE'],
    size: ['HTML_UPDATE'],
    fields: ['HTML_FIELD_UPDATE'],
    z: ['HTML_Z_INDEX'],
  }),

  // Run these upon first render
  initFlag: ElementView.prototype.initFlag.concat([
    'HTML_UPDATE',
    'HTML_FIELD_UPDATE',
    'HTML_Z_INDEX',
  ]),

  confirmUpdate: function () {
    var flags = ElementView.prototype.confirmUpdate.apply(this, arguments);
    if (this.hasFlag(flags, 'HTML_UPDATE')) {
      this.updateHTML();
      flags = this.removeFlag(flags, 'HTML_UPDATE');
    }
    if (this.hasFlag(flags, 'HTML_FIELD_UPDATE')) {
      this.updateFields();
      flags = this.removeFlag(flags, 'HTML_FIELD_UPDATE');
    }
    if (this.hasFlag(flags, 'HTML_Z_INDEX')) {
      this.updateZIndex();
      flags = this.removeFlag(flags, 'HTML_Z_INDEX');
    }
    return flags;
  },

  onRender: function () {
    this.removeHTMLMarkup();
    this.renderHTMLMarkup();
    return this;
  },

  renderHTMLMarkup: function () {
    var doc = joint.util.parseDOMJSON(this.model.htmlMarkup, joint.V.namespace.xhtml);
    var html = doc.selectors.htmlRoot;
    var fields = doc.groupSelectors.field;
    // React on all box changes. e.g. input change
    html.addEventListener('change', this.onFieldChange.bind(this), false);
    this.paper.htmlContainer.appendChild(doc.fragment);
    this.html = html;
    this.fields = fields;
    html.setAttribute('model-id', this.model.id);
  },

  removeHTMLMarkup: function () {
    var html = this.html;
    if (!html) return;
    this.paper.htmlContainer.removeChild(html);
    this.html = null;
    this.fields = null;
  },

  updateHTML: function () {
    var bbox = this.model.getBBox();
    var html = this.html;
    html.style.width = bbox.width + 'px';
    html.style.height = bbox.height + 'px';
    html.style.left = bbox.x + 'px';
    html.style.top = bbox.y + 'px';
  },

  onFieldChange: function (evt) {
    var input = evt.target;
    var attribute = input.dataset.attribute;
    if (attribute) {
      this.model.prop(['fields', attribute], input.value);
    }
  },

  updateFields: function () {
    this.fields.forEach(
      function (field) {
        var attribute = field.dataset.attribute;
        var value = this.model.prop(['fields', attribute]);
        switch (field.tagName.toUpperCase()) {
          case 'LABEL':
            field.textContent = value;
            break;
          case 'INPUT':
          case 'SELECT':
            field.value = value;
            if (value) {
              field.classList.remove('field-empty');
            } else {
              field.classList.add('field-empty');
            }
            break;
          case 'DIV':
            field.dataset[attribute] = value;
            break;
        }
      }.bind(this),
    );
  },

  updateZIndex: function () {
    this.html.style.zIndex = this.model.get('z') || 0;
  },

  onRemove: function () {
    this.removeHTMLMarkup();
  },
});

const cellNamespace = { sqlectron: SqlectronShapes, html: HTMLShapes };

export { joint, SqlectronShapes, HTMLShapes, cellNamespace };
