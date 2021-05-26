import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";

/**
 * This type provides the specification of the choropleth layer tool props model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolProps = ILayerToolProps & {
    dimensions: IChoroplethLayerToolDimensions | undefined;
    polygons: unknown; // TODO: specify the type
}
export default IChoroplethLayerToolProps;