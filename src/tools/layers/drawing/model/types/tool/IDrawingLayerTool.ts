// Geovisto core
import { DrawnObject, LayerType, LooseObject } from "..";
import { ILayerTool, IMapToolInitProps } from "../../../../../../index.core";
import IMapForm from "../../../../../../model/types/form/IMapForm";

import { IDrawingLayerToolConfig } from "./IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./IDrawingLayerToolDefaults";
import IDrawingLayerToolProps from "./IDrawingLayerToolProps";
import IDrawingLayerToolState from "./IDrawingLayerToolState";

export type EnabledEl = any; // TODO: create type

export type DrawingForm = IMapForm & {
  redrawTabContent: (type: LayerType | "") => void;
  getState(): TabState;
};

export type TabState = {
  tabControl: DrawingForm;
  enabledEl: EnabledEl;
  guideLayers: DrawnObject[];
  controls: LooseObject;
  initializeControls(): void;
  getSelectedColor(): string;
  getSelectedStroke(): number;
  getSelectedIcon(): string;
  setSelectedIcon(icon: string): void;
  callIdentifierChange(haveToCheckFilters: boolean): void;
  appendToIconSrcs(iconUrl: string): void;
  pushGuideLayer(layer: DrawnObject): void;
  setEnabledTool(val: EnabledEl): void;
  getEnabledTool(): EnabledEl;
};

/**
 * This interface declares the connection layer tool.
 *
 * @author Jiri Hynek
 */
interface IDrawingLayerTool<
  TProps extends IDrawingLayerToolProps = IDrawingLayerToolProps,
  TDefaults extends IDrawingLayerToolDefaults = IDrawingLayerToolDefaults,
  TState extends IDrawingLayerToolState = IDrawingLayerToolState,
  TConfig extends IDrawingLayerToolConfig = IDrawingLayerToolConfig,
  TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {
  drawingTools: LooseObject;
  /**
   * It creates a copy of the uninitialized tool.
   */
  copy(): IDrawingLayerTool;
  initializeDrawingTools(): void;
  applyEventListeners(layer: DrawnObject): void;
  highlightElement(el: DrawnObject): void;
  normalizeElement(el: DrawnObject): void;
  redrawMapForm(layerType: LayerType | ""): void;
}
export default IDrawingLayerTool;
