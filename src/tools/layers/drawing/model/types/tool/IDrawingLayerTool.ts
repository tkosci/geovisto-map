import {
  TSearchControl,
  TSearchControlState,
} from "./../../../sidebar/components/SearchControl/types";
import {
  TPolyControl,
  TPolyControlState,
} from "./../../../sidebar/components/PolyControl/types";
import {
  TMarkerControl,
  TMarkerControlState,
} from "./../../../sidebar/components/MarkerControl/types";
import {
  TDataControl,
  TDataControlState,
} from "./../../../sidebar/components/DataControl/types";
// Geovisto core
import { DrawnObject, LayerType, LooseObject } from "..";
import { ILayerTool, IMapToolInitProps } from "../../../../../../index.core";
import IMapForm from "../../../../../../model/types/form/IMapForm";
import { TAbstractControl } from "../../../sidebar/components/AbstractControl/types";

import { IDrawingLayerToolConfig } from "./IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./IDrawingLayerToolDefaults";
import IDrawingLayerToolProps from "./IDrawingLayerToolProps";
import IDrawingLayerToolState from "./IDrawingLayerToolState";
import { TBrushControl } from "../../../sidebar/components/BrushControl/types";

export type EnabledEl = any; // TODO: create type

export type DrawingForm = IMapForm & {
  redrawTabContent: (type: LayerType | "") => void;
  getState(): TabState;
  getTool(): IDrawingLayerTool;
};

export type Controls = {
  DataControl: TDataControl;
  MarkerControl: TMarkerControl;
  PolyControl: TPolyControl;
  SearchControl: TSearchControl;
  BrushControl: TBrushControl;
};

export type TabState = {
  tabControl: DrawingForm;
  enabledEl: EnabledEl;
  guideLayers: DrawnObject[];
  controls: Controls;
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
  getIntersectActivated(): boolean;
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
  getMapForm(): DrawingForm;
  setGlobalSimplificationTolerance(): void;
}
export default IDrawingLayerTool;
