// Geovisto core
import {
    IGeoDataManager,
    ILayerToolProps
} from "../../../../../../index.core";

import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";

/**
 * This type provides the specification of the choropleth layer tool props model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolProps = ILayerToolProps & {
    dimensions?: IChoroplethLayerToolDimensions;
    geoData?: IGeoDataManager;
}
export default IChoroplethLayerToolProps;