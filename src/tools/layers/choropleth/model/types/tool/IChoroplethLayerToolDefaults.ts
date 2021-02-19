// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IMap from "../../../../../../model/types/map/IMap";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";

import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";

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
     * It returns the default geo data dimension.
     */
    getGeoDataDimension(map?: IMap): IMapDimension<IGeoData>;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoIdDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDimension<IMapAggregationFunction>;
    
    /**
     * It returns the default geo data.
     */
    getGeoData(): IGeoData[];

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