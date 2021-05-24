import ILayerToolConfig from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This type provides specification of the choropleth layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolConfig = ILayerToolConfig & {
    data: {
        geo: string | undefined,
        value: string | undefined,
        aggregation: string | undefined
    };
}
export default IChoroplethLayerToolConfig;