import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { AbstractTool } from '../AbstractTool';

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
    const selectedLayer = this.getSelectedEl();

    EditTool.initNodeEdit(selectedLayer);
  };

  static initNodeEdit(selectedLayer: object, disable = false): void {
    if (selectedLayer?.editing) {
      if (selectedLayer.editing._enabled || disable) {
        selectedLayer.editing.disable();
      } else {
        selectedLayer.editing.enable();
      }
    }
  }

  static disableNodeEdit = (selectedEl) => {
    EditTool.initNodeEdit(selectedEl, true);
  };
}

export default EditTool;
