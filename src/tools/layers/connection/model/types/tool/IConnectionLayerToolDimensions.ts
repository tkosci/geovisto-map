// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";

/**
 * This type provides the specification of the connection layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDimension<IGeoData>,
    from: IMapDimension<IMapDataDomain>,
    to: IMapDimension<IMapDataDomain>,
}
export default IConnectionLayerToolDimensions;