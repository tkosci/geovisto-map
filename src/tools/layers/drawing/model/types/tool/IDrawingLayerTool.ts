// Geovisto core
import { DrawnObject, LayerType, LooseObject } from "..";
import { ILayerTool, IMapToolInitProps } from "../../../../../../index.core";

import { IDrawingLayerToolConfig } from "./IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./IDrawingLayerToolDefaults";
import IDrawingLayerToolProps from "./IDrawingLayerToolProps";
import IDrawingLayerToolState from "./IDrawingLayerToolState";

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
  redrawSidebarTabControl(layerType: LayerType | "", enabled: boolean): void;
  initializeDrawingTools(): void;
  applyEventListeners(layer: DrawnObject): void;
  highlightElement(el: DrawnObject): void;
  normalizeElement(el: DrawnObject): void;
}
export default IDrawingLayerTool;
