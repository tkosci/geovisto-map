// Geovisto core
import {
    ILayerToolConfig,
    ILayerToolDimensionsConfig
} from "../../../../../../index.core";

/**
 * This type provides specification of the choropleth layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolConfig = ILayerToolConfig & {
    data?: IChoroplethLayerToolDimensionsConfig;
}

/**
 * This type provides specification of the choropleth layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    geoData?: string,
    geoId?: string,
    value?: string,
    aggregation?: string,
    customColor?: boolean,
    color?: string,
    range?: number,
    scaling?: string,
    customMinMax?: boolean,
    minValue?: number,
    maxValue?: number,
}
export type { IChoroplethLayerToolConfig, IChoroplethLayerToolDimensionsConfig };