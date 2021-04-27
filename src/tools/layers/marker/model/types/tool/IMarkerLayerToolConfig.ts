import ILayerToolConfig from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This interface provides specification of the marker layer tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolConfig extends ILayerToolConfig {
    data: {
        geo: string | undefined,
        value: string | undefined,
        aggregation: string | undefined,
        category: string | undefined
    };
}
export default IMarkerLayerToolConfig;