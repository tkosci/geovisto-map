import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";

/**
 * This interface provide specification of the connection layer tool props model.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolProps extends ILayerToolProps {
    dimensions: IConnectionLayerToolDimensions | undefined;
    centroids: unknown; // TODO: specify the type
}
export default IConnectionLayerToolProps;