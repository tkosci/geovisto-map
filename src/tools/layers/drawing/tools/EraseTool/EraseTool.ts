import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { PaintTool } from '../PaintTool';

const ERASER_COLOR = '#ee000055';

class EraseTool extends PaintTool {
  static result = 'erased';

  constructor(props) {
    super(props);

    this.leafletMap.on('draw:created', this.created);
  }

  static NAME(): string {
    return 'eraser-drawing-tool';
  }

  getName(): string {
    return EraseTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-eraser';
  }

  getTitle(): string {
    return 'Eraser tool';
  }

  result = (): string => {
    return 'erased';
  };

  canBeCanceled = (): boolean => {
    return true;
  };

  created = (e) => {
    let layer = e.layer;
    if (!layer) return;
    if (e.layerType === this.result()) this.leafletMap.removeLayer(layer);
  };

  enable = (): void => {
    if (this._action == 'erase') {
      this.disable();
    } else {
      this.startErase();
    }
  };

  /**
   * creates circle around mouse cursor and applies event listeners
   */
  startErase = () => {
    this.stop();
    this._action = 'erase';
    this._addMouseListener();
    this._circle = L.circleMarker(this._latlng, {
      color: ERASER_COLOR,
    })
      .setRadius(this._circleRadius)
      .addTo(window.map);
  };

  /**
   * button for erasing is clicked
   *
   * @param {Object} event
   * @returns
   */
  erase = (event) => {
    if (event.type == 'mousedown') {
      L.DomEvent.stop(event);
      return;
    }
  };
}

export default EraseTool;
