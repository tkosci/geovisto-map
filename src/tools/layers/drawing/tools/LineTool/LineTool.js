import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { AbstractTool } from '../AbstractTool';

class LineTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'line-drawing-tool';
  }

  getName(): string {
    return LineTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-minus';
  }

  getTitle(): string {
    return 'Line drawing tool';
  }

  result = (): string => {
    return 'polyline';
  };

  canBeCanceled = (): boolean => {
    return true;
  };

  _polylineCreate = (): void => {
    this.tool = new L.Draw.Polyline(this.leafletMap, {
      shapeOptions: {
        color: this.sidebar.getState().getSelectedColor(),
        weight: this.sidebar.getState().getSelectedStroke(),
        draggable: true,
        transform: true,
      },
      guideLayers: this.sidebar.getState().guideLayers,
      repeatMode: true,
    });
    this.tool.enable();
  };

  enable = (): void => {
    this._polylineCreate();
  };
}

export default LineTool;
