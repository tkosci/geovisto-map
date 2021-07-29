// Geovisto core
import {
    IGeoData,
    IIntegerRangeManager,
    ILayerToolDimensions,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapTypeDimension
} from "../../../../../../index.core";

import IScale from "../scale/IScale";

/**
 * This type provides the specification of the choropleth layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDomainDimension<IGeoData>,
    geoId: IMapDomainDimension<IMapDataDomain>,
    value: IMapDomainDimension<IMapDataDomain>,
    aggregation: IMapDomainDimension<IMapAggregationFunction>,
    customColor: IMapTypeDimension<boolean>,
    color: IMapTypeDimension<string>,
    range: IMapTypeDimension<number, IIntegerRangeManager>,
    scaling: IMapDomainDimension<IScale>,
    customMinMax: IMapTypeDimension<boolean>,
    minValue: IMapTypeDimension<number>,
    maxValue: IMapTypeDimension<number>,

}
export default IChoroplethLayerToolDimensions;