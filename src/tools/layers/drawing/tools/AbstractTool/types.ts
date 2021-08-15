import { Map } from "leaflet";
import { LayerType } from "../../model/types";
import IDrawingLayerTool, {
  DrawingForm,
  EnabledEl,
} from "../../model/types/tool/IDrawingLayerTool";

export interface TAbstractTool {
  drawingTool: IDrawingLayerTool;
  sidebar: DrawingForm;
  leafletMap?: Map;
  tool: EnabledEl | null;
  _isActive: boolean;
  getName(): string;
  getIconName(): string;
  getTitle(): string;
  result(): LayerType | "";
  canBeCanceled(): boolean;
  _redrawSidebar(type?: LayerType | ""): void;
  setCurrentToolAsEnabled(): void;
  activate(): void;
  deactivate(): void;
  enable(): void;
  disable(): void;
  getSelectedEl(): EnabledEl | null;
  isToolActive(): boolean;
}

export type ToolProps = {
  drawingTool: IDrawingLayerTool;
};
