import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

class TransformTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'transform-drawing-tool';
  }

  getName(): string {
    return TransformTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-arrows-alt';
  }

  getTitle(): string {
    return 'Transform tool';
  }

  result = (): string => {
    return '';
  };

  enable = (): void => {
    const selected = this.getSelectedEl();

    this.initTransform(selected);
  };

  static initTransform(drawObject: object, disable = false): void {
    const layer = drawObject;
    if (layer?.transform) {
      if (layer.transform._enabled || disable) {
        layer.transform.disable();
        layer.dragging.disable();
        // TODO:
        this.drawingTool?.paintPoly?.updatePaintedPolys(layer.kIdx, layer);
      } else {
        layer.transform.enable({ rotation: true, scaling: true });
        layer.dragging.enable();
      }
    } else if (layer.layerType === 'marker') {
      if (layer.dragging._enabled || disable) {
        layer.dragging.disable();
      } else {
        layer.dragging.enable();
      }
    }
  }
}

export default TransformTool;
