import { Map } from 'leaflet';
import { DrawnObject, LayerType } from '../../model/types';

type LocalProps = {
  drawingTool: any;
};

interface TAbstractTool {
  drawingTool: any;
  sidebar: any;
  leafletMap: Map;
  tool: any;
  _isActive: boolean;
  NAME(): string;
  getName(): string;
  getIconName(): string;
  getTitle(): string;
  result(): LayerType | '';
  canBeCanceled(): boolean;
  _redrawSidebar(type?: LayerType | ''): void;
  setCurrentToolAsEnabled(): void;
  activate(): void;
  deactivate(): void;
  enable(): void;
  disable(): void;
  getSelectedEl(): DrawnObject;
  isToolActive(): boolean;
}

/**
 * Class is Abstract for Drawing tool/feature
 *
 * Drawing tool/feature enables user to create geospatial objects
 *
 * Each tool/feature creates different objects or has different approach for the object creation
 */
class AbstractTool implements TAbstractTool {
  private drawingTool;
  private sidebar;
  private leafletMap;
  private tool;
  private _isActive;

  constructor(props: LocalProps) {
    // * keeps DrawingLayerTool class/object
    this.drawingTool = props.drawingTool;
    this.sidebar = props.drawingTool.getSidebarTabControl();
    this.leafletMap = props.drawingTool.getMap().getState().getLeafletMap();

    // * variable for keeping L.Draw object so it is possible to enable/disable it
    this.tool = null;
    // * flag to find out if tool/feature is active
    this._isActive = false;
  }

  static NAME(): string {
    return 'abstract-drawing-tool';
  }

  /**
   * to be extended
   */
  getName(): string {
    return AbstractTool.NAME();
  }

  /**
   * to be extended
   */
  getIconName(): string {
    return 'fa fa-pencil';
  }

  /**
   * to be extended
   */
  getTitle(): string {
    return 'Abstract drawing tool';
  }

  /**
   * to be extended
   */
  result(): LayerType | '' {
    return '';
  }

  canBeCanceled(): boolean {
    return false;
  }

  _redrawSidebar(type?: LayerType | ''): void {
    this.drawingTool.redrawSidebarTabControl(type);
  }

  setCurrentToolAsEnabled(): void {
    this.sidebar.getState().setEnabledTool(this);
  }

  /**
   * because I want to run setCurrentToolAsEnabled every time enabled is run I wrap it with this function
   */
  activate(): void {
    this.setCurrentToolAsEnabled();
    this.enable();
    this._isActive = true;
    this._redrawSidebar(this.result());
  }

  deactivate(): void {
    this.disable();
    this.tool = null;
    this._isActive = false;
    this.sidebar.getState().setEnabledTool(null);
    this._redrawSidebar();
  }

  /**
   * to be extended
   */
  enable(): void {
    this._redrawSidebar(this.result());
  }

  /**
   * to be extended
   */
  disable(): void {
    const activeTool = this.tool;
    if (activeTool) {
      activeTool.disable();
    }
  }

  /**
   *
   * @returns currently selected geo. object
   */
  getSelectedEl(): DrawnObject {
    return this.drawingTool.getState().selectedLayer;
  }

  isToolActive(): boolean {
    return this._isActive;
  }
}

export default AbstractTool;
