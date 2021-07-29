// Geovisto core
import {
    IGeoData,
    IIntegerRangeManager,
    ILayerToolDefaults,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapTypeDimension
} from "../../../../../../index.core";

import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";
import IScale from "../scale/IScale";

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
    getGeoDataDimension(map?: IMap): IMapDomainDimension<IGeoData>;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoIdDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDomainDimension<IMapAggregationFunction>;

    /**
     * It returns the animate direction dimension.
     */
    getCustomColorDimension(): IMapTypeDimension<boolean>;

    /**
     * It returns the color dimension.
     */
    getColorDimension(): IMapTypeDimension<string>;

    /**
     * It returns the range dimension.
     */
    getRangeDimension(): IMapTypeDimension<number, IIntegerRangeManager>;

    /**
     * It returns the scaling dimension.
     */
    getScalingDimension(): IMapDomainDimension<IScale>;

    /**
     * It returns the custom min-max dimension.
     */
    getCustomMinMaxDimension(): IMapTypeDimension<boolean>;

    /**
     * It returns the min value dimension.
     */
    getMinValueDimension(): IMapTypeDimension<number>;

    /**
     * It returns the max value dimension.
     */
    getMaxValueDimension(): IMapTypeDimension<number>;
    
    /**
     * It returns the default geo data.
     */
    getGeoData(): IGeoData[];

    /**
     * It returns preferred z index for the choropoleth layer
     */
    getZIndex(): number;
}
export default IChoroplethLayerToolDefaults;