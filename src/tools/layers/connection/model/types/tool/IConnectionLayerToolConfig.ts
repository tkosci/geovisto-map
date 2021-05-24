import ILayerToolConfig from "../../../../../../model/types/layer/ILayerToolConfig";

/**
 * This type provides specification of the connection layer tool config model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolConfig = ILayerToolConfig & {
    data: {
        from: string | undefined,
        to: string | undefined,
    };
}
export default IConnectionLayerToolConfig;