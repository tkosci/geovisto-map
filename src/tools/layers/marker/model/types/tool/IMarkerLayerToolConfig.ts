import { ILayerToolConfig, ILayerToolDimensionsConfig } from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This type provides specification of the marker layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolConfig = ILayerToolConfig & {
    data: {
        geo: string | undefined,
        value: string | undefined,
        aggregation: string | undefined,
        category: string | undefined
    };
}

/**
 * This type provides specification of the marker layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    geo: string | undefined,
    value: string | undefined,
    aggregation: string | undefined,
    category: string | undefined
}
export type { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig };