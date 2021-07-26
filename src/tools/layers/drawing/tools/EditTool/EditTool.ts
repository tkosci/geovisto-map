import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { AbstractTool } from '../AbstractTool';
import { TEditTool } from './types';
import { ToolProps } from '../AbstractTool/types';
import { DrawnObject } from '../../model/types';

class EditTool extends AbstractTool implements TEditTool {
  constructor(props: ToolProps) {
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

  result = (): '' => {
    return '';
  };

  enable = (): void => {
    const selectedLayer = this.getSelectedEl();

    EditTool.initNodeEdit(selectedLayer);
  };

  static initNodeEdit(selectedLayer: DrawnObject, disable = false): void {
    if (selectedLayer?.editing) {
      if (selectedLayer.editing._enabled || disable) {
        selectedLayer.editing.disable();
      } else {
        selectedLayer.editing.enable();
      }
    }
  }

  static disableNodeEdit = (selectedEl: DrawnObject): void => {
    EditTool.initNodeEdit(selectedEl, true);
  };
}

export default EditTool;
