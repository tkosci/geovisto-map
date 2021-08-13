// Geovisto core
import {
  ILayerToolConfig,
  ILayerToolDimensionsConfig,
} from "../../../../../../index.core";

/**
 * This type provides specification of the Drawing layer tool config model.
 *
 * @author Jiri Hynek
 */
type IDrawingLayerToolConfig = ILayerToolConfig & {
  data: IDrawingLayerToolDimensionsConfig;
};

/**
 * This type provides specification of the Drawing layer tool dimensions config model.
 *
 * @author Jiri Hynek
 */
type IDrawingLayerToolDimensionsConfig = ILayerToolDimensionsConfig;

export type { IDrawingLayerToolConfig, IDrawingLayerToolDimensionsConfig };
