// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";

/**
 * This type provides the specification of the choropleth layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDimension<IGeoData>,
    geoId: IMapDimension<IMapDataDomain>,
    value: IMapDimension<IMapDataDomain>,
    aggregation: IMapDimension<IMapAggregationFunction>
}
export default IChoroplethLayerToolDimensions;