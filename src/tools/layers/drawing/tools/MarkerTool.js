import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';
import { iconStarter } from '../util/constants';

/**
 * @author Andrej Tlcina
 */

/**
 * extends marker so we can change its options while marker tool is enabled
 */
L.Draw.ExtendedMarker = L.Draw.Marker.extend({
  setIconOptions: function (iconOpts) {
    this.options.icon = iconOpts;
  },
});

class MarkerTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'marker-drawing-tool';
  }

  getName(): string {
    return MarkerTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-map-marker';
  }

  getTitle(): string {
    return 'Marker drawing tool';
  }

  result = (): string => {
    return 'marker';
  };

  canBeCanceled = (): boolean => {
    return true;
  };

  _markerCreate = (connectClick = false): void => {
    const additionalOpts = { iconUrl: this.sidebar.getState().getSelectedIcon(), connectClick };
    const icon = new L.Icon({ ...iconStarter, ...additionalOpts });
    const { guideLayers } = this.sidebar.getState();

    this.tool = new L.Draw.ExtendedMarker(this.leafletMap, {
      icon,
      draggable: true,
      transform: true,
      repeatMode: true,
      guideLayers,
      snapVertices: false,
    });
    this.sidebar.getState().setEnabledEl(this.tool);
    this.tool.enable();
  };

  enable = (): void => {
    this._redrawSidebar(this.result());
    this._disableActive();
    this._markerCreate();
  };
}

export default MarkerTool;
