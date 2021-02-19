// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";

/**
 * This type provides the specification of the marker layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IMarkerLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDimension<IGeoData>,
    geoId: IMapDimension<IMapDataDomain>,
    value: IMapDimension<IMapDataDomain>,
    aggregation: IMapDimension<IMapAggregationFunction>,
    category: IMapDimension<IMapDataDomain>
}
export default IMarkerLayerToolDimensions;