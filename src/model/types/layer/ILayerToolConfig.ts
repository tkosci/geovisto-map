import IMapToolConfig from "../tool/IMapToolConfig";

/**
 * This type provides specification of the layer tool config model.
 * 
 * @author Jiri Hynek
 */
type ILayerToolConfig = IMapToolConfig & {
    name: string | undefined;
}
export default ILayerToolConfig;