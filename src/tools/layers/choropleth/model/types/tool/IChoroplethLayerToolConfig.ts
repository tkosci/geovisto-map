import { ILayerToolConfig, ILayerToolDimensionsConfig } from "../../../../../../model/types/layer/ILayerToolConfig";

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
    aggregation?: string
}
export type { IChoroplethLayerToolConfig, IChoroplethLayerToolDimensionsConfig };