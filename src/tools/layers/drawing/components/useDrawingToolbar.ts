import * as L from "leaflet";
import "leaflet/dist/leaflet.css";

import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import "../style/drawingLayer.scss";
import { EditTool, TransformTool } from "../tools";
import IDrawingLayerTool from "../model/types/tool/IDrawingLayerTool";
import { DrawnObject, Optional, Tool } from "../model/types";

type DrawingBtns = { [key: string]: HTMLAnchorElement };

type Options = L.ControlOptions & {
  map?: L.Map;
  tool: Optional<IDrawingLayerTool>;
  drawingBtns?: DrawingBtns;
};

// don't know how to define class DrawingToolbar that extends Control without needing to define method addTo and others...
declare module "leaflet" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Control {
    class DrawingToolbar {
      public options: Options;
      public constructor(options?: Options);
      public initialize(options: Options): void;
      public createUi(): HTMLDivElement;
      public _disableDrawing(e: Event, tool: Tool): void;
      public getSelectedEl(): Optional<DrawnObject> | undefined;
      public createToolbarBtn(
        className: string,
        btnContainer: HTMLDivElement,
        title: string,
        icon: string,
        extra: boolean
      ): HTMLAnchorElement;
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
      position: "topleft",
      drawingBtns: {},
      map: undefined,
      tool: null,
    } as Options,
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
     */
    onAdd: function (map: L.Map) {
      this.options.map = map;
      return this.createUi();
    },
    /**
     * creates toolbar with multiple buttons
     */
    createUi: function () {
      const topContainer = L.DomUtil.create("div", "drawingtoolbar");
      const toolContainer = L.DomUtil.create(
        "div",
        "leaflet-bar leaflet-control",
        topContainer
      );
      toolContainer.style.cursor = "pointer";
      const cancelables: HTMLAnchorElement[] = [];

      const toggleExtra = (e: L.LeafletEvent, tool: Tool) => {
        cancelables.forEach((btn) =>
          btn?.lastElementChild?.classList?.add("hide")
        );
        let extraBtn = e?.target?.lastChild;
        if (!extraBtn) extraBtn = e?.target?.nextSibling;
        // * careful not to hide the icon
        if (extraBtn?.tagName === "I") return;
        if (extraBtn) {
          console.log({ extraBtn });
          extraBtn.classList.toggle("hide");
          L.DomEvent.on(
            extraBtn,
            "click",
            (e) => this._disableDrawing(e, tool),
            this
          );
        }
      };

      const drawingTools = this.options.tool?.drawingTools || {};

      const handleClick = (e: Event, tool: Tool) => {
        const selectedEl = this.getSelectedEl();
        // * functions are called so user is not drawing over object that has transform handles
        if (tool.getName() !== "transform-drawing-tool") {
          if (selectedEl) TransformTool.disableTransform(selectedEl);
        }
        if (tool.getName() !== "edit-drawing-tool") {
          if (selectedEl) EditTool.disableNodeEdit(selectedEl);
        }

        toggleExtra((e as unknown) as L.LeafletEvent, tool);
        tool.activate();
      };

      Object.keys(drawingTools).forEach((key) => {
        const tool: Tool = drawingTools[key];
        const canBeCanceled = tool.canBeCanceled();

        const btn = this.createToolbarBtn(
          tool.getName(),
          toolContainer,
          tool.getTitle(),
          tool.getIconName(),
          canBeCanceled
        );

        if (canBeCanceled) cancelables.push(btn);

        L.DomEvent.on(btn, "click", (e) => handleClick(e, tool), this);

        (this.options.drawingBtns as DrawingBtns)[key] = btn;
      });

      L.DomEvent.disableClickPropagation(topContainer);
      return topContainer;
    },

    /**
     * disables enabled tool (markers, polylines, polygons, brush tool, eraser)
     *
     * @param {Object} e
     */
    _disableDrawing: function (e: Event, tool: Tool) {
      e.stopPropagation();
      (e.target as HTMLElement).classList.add("hide");
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
      extra = false
    ) {
      const returnBtn = L.DomUtil.create(
        "a",
        `${className} d-side-button`,
        btnContainer
      );
      returnBtn.title = title;
      returnBtn.innerHTML = `<i class="${icon}" aria-hidden="true"></i>`;
      // returnBtn.role = 'button';
      if (extra) {
        const extraBtn = L.DomUtil.create("a", "extra-btn hide", returnBtn);
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
      return this.options.tool?.getState()?.selectedLayer;
    },
  });

  L.control.drawingToolbar = function (options?: Options) {
    if (!options) {
      options = {} as Options;
    }
    return new L.Control.DrawingToolbar(options);
  };
}
