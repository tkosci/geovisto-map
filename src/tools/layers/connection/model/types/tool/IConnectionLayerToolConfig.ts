import ILayerToolConfig from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This interface provides specification of the connection layer tool config model.
 * 
 * It contains only basic data types.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolConfig extends ILayerToolConfig {
    data: {
        from: string | undefined,
        to: string | undefined,
    };
}
export default IConnectionLayerToolConfig;