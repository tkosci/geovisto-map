import React from 'react';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import GeometricSliceTool from './GeometricSliceTool';

class FreehandSliceTool extends GeometricSliceTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'freehand-slice-drawing-tool';
  }

  getName(): string {
    return FreehandSliceTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-cutlery';
  }

  getTitle(): string {
    return 'Freehand slice tool';
  }

  result = (): string => {
    return 'knife';
  };

  canBeCanceled = (): boolean => {
    return true;
  };

  _enableSlicing = (): void => {
    const pather = this.sidebar.getState().pather;
    const patherStatus = this.sidebar.getState().patherActive;
    if (!patherStatus) {
      this.leafletMap.addLayer(pather);
      this.sidebar.getState().setEnabledEl({
        disable: () => {
          this.leafletMap.removeLayer(pather);
          this.sidebar.getState().setPatherStatus(false);
        },
      });
    } else {
      this.leafletMap.removeLayer(pather);
      this.sidebar.getState().setEnabledEl(null);
    }

    this.sidebar.getState().setPatherStatus(!patherStatus);
  };

  /**
   * @brief slices selected polygon with pather's freehand line
   *
   * @param {Object} e
   */
  createdPath = (e) => {
    // * get polyline object
    const layer = e.polyline.polyline;

    // * get Leaflet map
    const map = this.leafletMap;

    // * get sidebar state and pather object
    const sidebarState = this.drawingTool.getSidebarTabControl().getState();
    const pather = sidebarState.pather;
    // * SLICE
    this.polySlice(layer);

    // * we do not want path to stay
    pather.removePath(layer);
    // * we do not want to keep cutting (drawing)
    map.removeLayer(pather);
    sidebarState.setPatherStatus(false);
    // * restore state
    let enabled = sidebarState.getEnabledEl();
    if (enabled) {
      sidebarState.setEnabledEl(null);
      this._redrawSidebar();
    }
    const knifeBtn = document.querySelector('.drawingtoolbar .sliceBtn .extra-btn');
    if (knifeBtn) knifeBtn.classList.add('hide');
  };

  enable = (): void => {
    this._redrawSidebar(this.result());
    this._enableSlicing();
  };
}

export default FreehandSliceTool;
