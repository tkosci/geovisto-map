import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import PaintTool from './PaintTool';

const ERASER_COLOR = '#ee000055';

class EraseTool extends PaintTool {
  constructor(props) {
    super(props);
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

  enable = (): void => {
    this._redrawSidebar(this.result());
    this._disableActive();
    if (this._action == 'erase') {
      this.disable();
    } else {
      this.startErase();
      this._active = true;
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
