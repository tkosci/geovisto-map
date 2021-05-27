import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMap from "../../../../../../model/types/map/IMap";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(map?: IMap): IMarkerLayerToolDimensions;

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
     * It returns the default category dimension.
     */
    getCategoryDimension(map?: IMap): IMapDimension<IMapDataDomain>;
    
    /**
     * It returns the default centroids.
     */
    getCentroids(map?: IMap): unknown;
}
export default IMarkerLayerToolDefaults;