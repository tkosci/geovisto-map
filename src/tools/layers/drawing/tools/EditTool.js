import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import AbstractTool from './AbstractTool';

class EditTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'edit-drawing-tool';
  }

  getName(): string {
    return EditTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-square';
  }

  getTitle(): string {
    return 'Edit nodes tool';
  }

  result = (): string => {
    return '';
  };

  enable = (): void => {
    this.initNodeEdit();
  };

  initNodeEdit(disable = false): void {
    const selectedLayer = this.getSelectedEl();

    if (selectedLayer?.editing) {
      if (selectedLayer.editing._enabled || disable) {
        selectedLayer.editing.disable();
        // let paintPoly = this.options.tool.getSidebarTabControl().getState().paintPoly;
        // paintPoly.updatePaintedPolys(layer.kIdx, layer);
      } else {
        selectedLayer.editing.enable();
      }
    }
  }
}

export default EditTool;
