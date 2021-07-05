import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

class RemoveTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'remove-drawing-tool';
  }

  getName(): string {
    return RemoveTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-times';
  }

  getTitle(): string {
    return 'Remove tool';
  }

  result = (): string => {
    return '';
  };

  enable = (): void => {
    this.removeElement();
  };

  removeElement(): void {
    const state = this.drawingTool.getState();
    const selectedLayer = this.getSelectedEl();
    // * if marker is being removed, remove its vertices if any
    if (state.selectedLayerIsConnectMarker()) {
      state.removeMarkersMappedVertices(selectedLayer._leaflet_id);
    }
    if (selectedLayer?.layerType === 'vertice') {
      state.removeGivenVertice(selectedLayer._leaflet_id);
    }
    // TODO:
    this.drawingTool?.paintPoly?.clearPaintedPolys(selectedLayer?.kIdx);
    state.removeSelectedLayer();
    this._redrawSidebar(null);
  }
}

export default RemoveTool;
