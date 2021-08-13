// Geovisto core
import { ILayerToolState } from "../../../../../../index.core";
import {
  IDrawingLayerToolConfig,
  IDrawingLayerToolDimensionsConfig,
} from "./IDrawingLayerToolConfig";
import IDrawingLayerToolDefaults from "./IDrawingLayerToolDefaults";
import IDrawingLayerToolDimensions from "./IDrawingLayerToolDimensions";
import IDrawingLayerToolProps from "./IDrawingLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 *
 * @author Jiri Hynek
 */
interface IDrawingLayerToolState<
  TProps extends IDrawingLayerToolProps = IDrawingLayerToolProps,
  TDefaults extends IDrawingLayerToolDefaults = IDrawingLayerToolDefaults,
  TConfig extends IDrawingLayerToolConfig = IDrawingLayerToolConfig,
  TDimensionsConfig extends IDrawingLayerToolDimensionsConfig = IDrawingLayerToolDimensionsConfig,
  TDimensions extends IDrawingLayerToolDimensions = IDrawingLayerToolDimensions
> extends ILayerToolState<
    TProps,
    TDefaults,
    TConfig,
    TDimensionsConfig,
    TDimensions
  > {}
export default IDrawingLayerToolState;
