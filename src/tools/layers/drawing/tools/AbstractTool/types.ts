import { Map } from 'leaflet';
import { DrawnObject, LayerType } from '../../model/types';

export interface TAbstractTool {
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

export type ToolProps = {
  drawingTool: any;
};
