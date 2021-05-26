import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";

/**
 * This type provides the specification of the connection layer tool props model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolProps = ILayerToolProps & {
    dimensions: IConnectionLayerToolDimensions | undefined;
    centroids: unknown; // TODO: specify the type
}
export default IConnectionLayerToolProps;