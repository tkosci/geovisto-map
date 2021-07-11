import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { AbstractTool } from '../AbstractTool';
import { EditTool } from '../EditTool';

class DeselectTool extends AbstractTool {
  constructor(props) {
    super(props);
  }

  static NAME(): string {
    return 'deselect-drawing-tool';
  }

  getName(): string {
    return DeselectTool.NAME();
  }

  getIconName(): string {
    return 'fa fa-star-half-o';
  }

  getTitle(): string {
    return 'Deselect tool';
  }

  result = (): string => {
    return '';
  };

  enable = (): void => {
    const selected = this.getSelectedEl();

    DeselectTool.deselect(selected, this.drawingTool);
  };

  static deselect(selected, tool) {
    if (selected?.editing?._enabled) {
      selected.editing.disable();
    }
    if (selected) {
      tool?.normalizeElement(selected);
      EditTool.initNodeEdit(selected, true);
      tool?.getState().clearSelectedLayer();
      tool?.redrawSidebarTabControl();
      document.querySelector('.leaflet-container').style.cursor = '';
    }
  }
}

export default DeselectTool;
