import { ILayerToolConfig, ILayerToolDimensionsConfig } from "../../../../../../model/types/layer/ILayerToolConfig";


/**
 * This type provides specification of the connection layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolConfig = ILayerToolConfig & {
    data: IConnectionLayerToolDimensionsConfig | undefined;
}

/**
 * This type provides specification of the connection layer tool dimensions config model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolDimensionsConfig = ILayerToolDimensionsConfig & {
    from: string | undefined,
    to: string | undefined,
}
export type { IConnectionLayerToolConfig, IConnectionLayerToolDimensionsConfig };