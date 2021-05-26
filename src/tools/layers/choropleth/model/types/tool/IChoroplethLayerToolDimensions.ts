import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";

/**
 * This type provides the specification of the choropleth layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IChoroplethLayerToolDimensions = ILayerToolDimensions & {
    geo: IMapDimension<IMapDataDomain>,
    value: IMapDimension<IMapDataDomain>,
    aggregation: IMapDimension<IMapAggregationFunction>
}
export default IChoroplethLayerToolDimensions;