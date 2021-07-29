// Geovisto core
import {
    IGeoDataManager,
    ILayerToolProps
} from "../../../../../../index.core";

import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";

/**
 * This type provides the specification of the connection layer tool props model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolProps = ILayerToolProps & {
    dimensions?: IConnectionLayerToolDimensions;
    geoData?: IGeoDataManager;
}
export default IConnectionLayerToolProps;