// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import IIntegerRangeManager from "../../../../../../model/types/type/IIntegerRangeManager";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDomainDimension from "../../../../../../model/types/dimension/IMapDomainDimension";
import IMapTypeDimension from "../../../../../../model/types/dimension/IMapTypeDimension";
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