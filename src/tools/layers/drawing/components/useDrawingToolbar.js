import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import '../style/drawingLayer.scss';

/**
 * @author Andrej Tlcina
 */
export default function useDrawingToolbar() {
  L.Control.DrawingToolbar = L.Control.extend({
    options: {
      position: 'topleft',
      drawingBtns: {},
    },
    /**
     * runs whenever you create instance
     *
     * @param {Object} options
     */
    initialize: function (options) {
      if (options) {
        L.setOptions(this, options);
      }
    },
    /**
     * runs whenever control is being added
     *
     * @param {Object} map
     * @returns
     */
    onAdd: function (map) {
      this.options.map = map;
      return this.createUi();
    },
    /**
     * creates toolbar with multiple buttons
     *
     * @param {Object} map
     * @returns HTML element wrapping all the buttons
     */
    createUi: function (map) {
      const topContainer = L.DomUtil.create('div', 'drawingtoolbar');
      const toolContainer = L.DomUtil.create('div', 'leaflet-bar leaflet-control', topContainer);
      toolContainer.style.cursor = 'pointer';
      const cancalables = [];

      const toggleExtra = (e, tool) => {
        cancalables.forEach((btn) => btn.lastChild.classList.add('hide'));
        let extraBtn = e.target.lastChild;
        if (!extraBtn) extraBtn = e.target.nextSibling;
        extraBtn.classList.toggle('hide');
        L.DomEvent.on(extraBtn, 'click', (e) => this._disableDrawing(e, tool), this);
      };

      const drawingTools = this.options.tool.drawingTools;

      Object.keys(drawingTools).forEach((key) => {
        let tool = drawingTools[key];
        let canBeCanceled = tool.canBeCanceled();

        let btn = this.createToolbarBtn(
          tool.getName(),
          toolContainer,
          tool.getTitle(),
          tool.getIconName(),
          canBeCanceled,
        );

        if (canBeCanceled) cancalables.push(btn);

        L.DomEvent.on(btn, 'click', tool.enable, this);
        L.DomEvent.on(btn, 'click', (e) => toggleExtra(e, tool), this);

        this.options.drawingBtns[key] = btn;
      });

      this.addEventListeners();
      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    /**
     * adds event listeners
     */
    addEventListeners: function () {
      // // * on click disable transform/node edit if is active
      // const btnsArr = Object.values(this.options.drawingBtns);
      // btnsArr.forEach((btn) => {
      //   if (!btn.className.includes('transformBtn')) {
      //     L.DomEvent.on(btn, 'click', this._disableTransform, this);
      //   }
      //   if (!btn.className.includes('editBtn')) {
      //     L.DomEvent.on(btn, 'click', this._disableNodeEdit, this);
      //   }
      // });
    },

    /**
     * disables enabled tool (markers, polylines, polygons, brush tool, eraser)
     *
     * @param {Object} e
     */
    _disableDrawing: function (e, tool) {
      e.stopPropagation();
      e?.target?.classList?.toggle('hide');
      tool.disable();
    },

    /**
     * disables transform of selected geo. object
     */
    _disableTransform: function () {
      const layer = this.getSelectedEl();

      if (layer?.transform?._enabled) {
        layer.transform.disable();
        layer.dragging.disable();
        let paintPoly = this.getSidebar().getState().paintPoly;
        paintPoly.updatePaintedPolys(layer.kIdx, layer);
      }
    },

    /**
     * disables node edit
     */
    _disableNodeEdit: function () {
      this.options.tool.initNodeEdit(true);
    },

    /**
     * creates toolbar button
     *
     * @param {String} className
     * @param {Object} btnContainer
     * @param {String} title
     * @param {String} icon
     * @param {Boolean} extra
     * @returns button to put into toolbar
     */
    createToolbarBtn: function (className, btnContainer, title, icon, extra = false) {
      const returnBtn = L.DomUtil.create('a', `${className} d-side-button`, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      returnBtn.role = 'button';
      if (extra) {
        const extraBtn = L.DomUtil.create('a', 'extra-btn hide', returnBtn);
        extraBtn.innerHTML = `Cancel`;
        extraBtn.role = 'button';
      }
      return returnBtn;
    },

    /**
     *
     * @returns currently selected geo. object
     */
    getSelectedEl: function () {
      return this.options.tool.getState().selectedLayer;
    },

    /**
     *
     * @returns sidebar object
     */
    getSidebar: function () {
      return this.options.tool.getSidebarTabControl();
    },
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
