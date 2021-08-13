// Geovisto core
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
  /**
   * It creates a copy of the uninitialized tool.
   */
  copy(): IDrawingLayerTool;
}
export default IDrawingLayerTool;
