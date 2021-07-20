import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';

import '../style/drawingLayer.scss';
import { EditTool, TransformTool } from '../tools';

type Options = { map?: L.Map };
declare module 'leaflet' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Control {
    class DrawingToolbar extends Control {
      constructor(options: Options);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace control {
    function drawingToolbar(options?: Options): Control.DrawingToolbar;
  }
}

/**
 * @author Andrej Tlcina
 */
export default function useDrawingToolbar(): void {
  L.Control.DrawingToolbar = L.Control.extend({
    options: {
      position: 'topleft',
      drawingBtns: {},
      map: {},
    },
    /**
     * runs whenever you create instance
     *
     * @param {Object} options
     */
    initialize: function (options: Options) {
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
    onAdd: function (map: L.Map) {
      this.options.map = map;
      return this.createUi();
    },
    /**
     * creates toolbar with multiple buttons
     *
     * @param {Object} map
     * @returns HTML element wrapping all the buttons
     */
    createUi: function () {
      const topContainer = L.DomUtil.create('div', 'drawingtoolbar');
      const toolContainer = L.DomUtil.create('div', 'leaflet-bar leaflet-control', topContainer);
      toolContainer.style.cursor = 'pointer';
      const cancelables: HTMLAnchorElement[] = [];

      const toggleExtra = (e: L.LeafletEvent, tool) => {
        cancelables.forEach((btn) => btn?.lastElementChild?.classList?.add('hide'));
        let extraBtn = e?.target?.lastChild;
        if (!extraBtn) extraBtn = e?.target?.nextSibling;
        // * careful not to hide the icon
        if (extraBtn?.tagName === 'I') return;
        if (extraBtn) {
          extraBtn.classList.toggle('hide');
          L.DomEvent.on(extraBtn, 'click', (e) => this._disableDrawing(e, tool), this);
        }
      };

      const drawingTools = this.options.tool.drawingTools;

      const handleClick = (e: Event, tool) => {
        const selectedEl = this.getSelectedEl();
        // * functions are called so user is not drawing over object that has transform handles
        if (tool.getName() !== 'transform-drawing-tool') {
          TransformTool.disableTransform(selectedEl);
        }
        if (tool.getName() !== 'edit-drawing-tool') {
          EditTool.disableNodeEdit(selectedEl);
        }

        toggleExtra((e as unknown) as L.LeafletEvent, tool);
        tool.activate();
      };

      Object.keys(drawingTools).forEach((key) => {
        const tool = drawingTools[key];
        const canBeCanceled = tool.canBeCanceled();

        const btn = this.createToolbarBtn(
          tool.getName(),
          toolContainer,
          tool.getTitle(),
          tool.getIconName(),
          canBeCanceled,
        );

        if (canBeCanceled) cancelables.push(btn);

        L.DomEvent.on(btn, 'click', (e) => handleClick(e, tool), this);

        L.DomEvent.off(btn, 'click', (e) => handleClick(e, tool), this);

        this.options.drawingBtns[key] = btn;
      });

      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    /**
     * disables enabled tool (markers, polylines, polygons, brush tool, eraser)
     *
     * @param {Object} e
     */
    _disableDrawing: function (e: L.LeafletEvent, tool) {
      e?.target?.classList?.add('hide');
      tool.deactivate();
    },

    /**
     * creates toolbar button
     */
    createToolbarBtn: function (
      className: string,
      btnContainer: HTMLDivElement,
      title: string,
      icon: string,
      extra = false,
    ) {
      const returnBtn = L.DomUtil.create('a', `${className} d-side-button`, btnContainer);
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      // returnBtn.role = 'button';
      if (extra) {
        const extraBtn = L.DomUtil.create('a', 'extra-btn hide', returnBtn);
        extraBtn.innerHTML = `Cancel`;
        // extraBtn.role = 'button';
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

  L.control.drawingToolbar = function (options?: Options) {
    if (!options) {
      options = {};
    }
    return new L.Control.DrawingToolbar(options);
  };
}
