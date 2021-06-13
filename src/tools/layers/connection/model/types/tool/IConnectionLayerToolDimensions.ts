import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IGeoData from "../../../../../../model/types/geodata/IGeoData";

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