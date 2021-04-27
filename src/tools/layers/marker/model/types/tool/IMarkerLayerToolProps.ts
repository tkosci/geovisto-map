import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";

/**
 * This interface provide specification of the marker layer tool props model.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolProps extends ILayerToolProps {
    dimensions: IMarkerLayerToolDimensions | undefined;
    centroids: any; // TODO: specify the type
}
export default IMarkerLayerToolProps;