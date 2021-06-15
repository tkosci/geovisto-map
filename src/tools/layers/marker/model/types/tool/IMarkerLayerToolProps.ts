import IGeoDataManager from "../../../../../../model/types/geodata/IGeoDataManager";
import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";

/**
 * This type provides the specification of the marker layer tool props model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolProps = ILayerToolProps & {
    dimensions?: IMarkerLayerToolDimensions;
    geoData?: IGeoDataManager;
}
export default IMarkerLayerToolProps;