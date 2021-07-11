import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import '../style/drawingLayer.scss';
import { EditTool, TransformTool } from '../tools';

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
      const cancelables = [];

      const toggleExtra = (e, tool) => {
        cancelables.forEach((btn) => btn.lastChild.classList.add('hide'));
        let extraBtn = e.target.lastChild;
        if (!extraBtn) extraBtn = e.target.nextSibling;
        // * careful not to hide the icon
        if (extraBtn?.tagName === 'I') return;
        if (extraBtn) {
          extraBtn.classList.toggle('hide');
          L.DomEvent.on(extraBtn, 'click', (e) => this._disableDrawing(e, tool), this);
        }
      };

      const drawingTools = this.options.tool.drawingTools;

      const handleClick = (e, tool) => {
        const selectedEl = this.getSelectedEl();
        // * functions are called so user is not drawing over object that has transform handles
        if (tool.getName() !== 'transform-drawing-tool') {
          TransformTool.disableTransform(selectedEl);
        }
        if (tool.getName() !== 'edit-drawing-tool') {
          EditTool.disableNodeEdit(selectedEl);
        }

        toggleExtra(e, tool);
        tool.activate();
      };

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

        if (canBeCanceled) cancelables.push(btn);

        L.DomEvent.on(btn, 'click', (e) => handleClick(e, tool), this);

        this.options.drawingBtns[key] = btn;
      });

      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    onRemove: function (map) {},

    /**
     * disables enabled tool (markers, polylines, polygons, brush tool, eraser)
     *
     * @param {Object} e
     */
    _disableDrawing: function (e, tool) {
      e.stopPropagation();
      e?.target?.classList?.add('hide');
      tool.deactivate();
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
  });

  L.control.drawingToolbar = function (options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
