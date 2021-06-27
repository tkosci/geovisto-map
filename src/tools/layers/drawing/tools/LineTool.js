import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

const NAME = 'line-drawing-tool';

class LineTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return NAME;
  }

  getName(): string {
    return NAME;
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

  _polylineCreate = (map: any, sidebar: any): void => {
    this.tool = new L.Draw.Polyline(map, {
      shapeOptions: {
        color: sidebar.getState().getSelectedColor(),
        weight: sidebar.getState().getSelectedStroke(),
        draggable: true,
        transform: true,
      },
      guideLayers: sidebar.getState().guideLayers,
      repeatMode: true,
    });
    this.sidebar.getState().setEnabledEl(this.tool);
    this.tool.enable();
  };

  enable = (): void => {
    console.log(this);
    this._redrawSidebar(this.result());
    this._polylineCreate(this.leafletMap, this.sidebar);
  };
}

export default LineTool;
