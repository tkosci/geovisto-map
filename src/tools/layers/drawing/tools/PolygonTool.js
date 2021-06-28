import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

class PolygonTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'polygon-drawing-tool';
  }

  getName(): string {
    return PolygonTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-star';
  }

  getTitle(): string {
    return 'Polygon drawing tool';
  }

  result = (): string => {
    return 'polygon';
  };

  canBeCanceled = (): boolean => {
    return true;
  };

  _polygonCreate = (): void => {
    this.tool = new L.Draw.Polygon(this.leafletMap, {
      allowIntersection: false,
      drawError: {
        color: '#e1e100',
        message: '<strong>You cannot draw that!<strong>',
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
    });
    this.sidebar.getState().setEnabledEl(this.tool);
    this.tool.enable();
  };

  enable = (): void => {
    this._redrawSidebar(this.result());
    this._polygonCreate();
  };
}

export default PolygonTool;
