// Geovisto core
import { ILayerToolConfig, ILayerToolDimensionsConfig } from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This type provides specification of the connection layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolConfig = ILayerToolConfig & {
    data?: IConnectionLayerToolDimensionsConfig;
}

/**
 * This type provides specification of the connection layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    geoData?: string,
    from?: string,
    to?: string,
    direction?: boolean,
}
export type { IConnectionLayerToolConfig, IConnectionLayerToolDimensionsConfig };