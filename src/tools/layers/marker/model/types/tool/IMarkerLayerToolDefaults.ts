import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(): IMarkerLayerToolDimensions;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoDimension(): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDimension<IMapAggregationFunction>;

    /**
     * It returns the default category dimension.
     */
    getCategoryDimension(): IMapDimension<IMapDataDomain>;
    
    /**
     * It returns the default centroids.
     */
    getCentroids(): any;
}
export default IMarkerLayerToolDefaults;