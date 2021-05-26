import { ILayerToolConfig, ILayerToolDimensionsConfig } from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This type provides specification of the choropleth layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolConfig = ILayerToolConfig & {
    data: IChoroplethLayerToolDimensionsConfig | undefined;
}

/**
 * This type provides specification of the choropleth layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    geo: string | undefined,
    value: string | undefined,
    aggregation: string | undefined
}
export type { IChoroplethLayerToolConfig, IChoroplethLayerToolDimensionsConfig };