import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMap from "../../../../../../model/types/map/IMap";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(map?: IMap): IChoroplethLayerToolDimensions;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDimension<IMapAggregationFunction>;
    
    /**
     * It returns the default polygons.
     * 
     * TODO: specify the type.
     */
    getPolygons(map?: IMap): unknown;

    /**
     * It returns preferred z index for the choropoleth layer
     */
    getZIndex(): number;

    /**
     * It returns the values scale.
     */
    getScale(): number[];
}
export default IChoroplethLayerToolDefaults;