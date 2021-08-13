import { ToolProps } from "./../AbstractTool/types";
import L from "leaflet";
import "leaflet-path-drag";
import "leaflet-path-transform";
import "leaflet-draw";

import { AbstractTool } from "../AbstractTool";
import { TPolygonTool } from "./types";
import { LayerType } from "../../model/types";

class PolygonTool extends AbstractTool implements TPolygonTool {
  static result = "polygon";

  constructor(props: ToolProps) {
    super(props);
  }

  public static NAME(): string {
    return "polygon-drawing-tool";
  }

  public getName(): string {
    return PolygonTool.NAME();
  }

  public getIconName(): string {
    return "fa fa-star";
  }

  public getTitle(): string {
    return "Polygon drawing tool";
  }

  public result = (): LayerType => {
    return "polygon";
  };

  public canBeCanceled = (): boolean => {
    return true;
  };

  private _polygonCreate = (): void => {
    this.tool = new L.Draw.Polygon(this.leafletMap, {
      allowIntersection: false,
      drawError: {
        color: "#e1e100",
        message: "<strong>You cannot draw that!<strong>",
      },
      shapeOptions: {
        color: this.sidebar.getState().getSelectedColor(),
        weight: this.sidebar.getState().getSelectedStroke(),
        draggable: true,
        transform: true,
      },
      guideLayers: this.sidebar.getState().guideLayers,
      snapDistance: 5,
      repeatMode: true,
    } as any);
    this.tool.enable();
  };

  public enable = (): void => {
    this._polygonCreate();
  };
}

export default PolygonTool;
