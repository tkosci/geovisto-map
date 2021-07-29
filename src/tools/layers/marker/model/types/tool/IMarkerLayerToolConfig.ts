// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig
} from "../../../../../../index.core";

/**
 * This type provides specification of the marker layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolConfig = ILayerToolConfig & {
    data: IMarkerLayerToolDimensionsConfig;
}

/**
 * This type provides specification of the marker layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    geoData?: string,
    geoId?: string,
    value?: string,
    aggregation?: string,
    category?: string
}
export type { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig };