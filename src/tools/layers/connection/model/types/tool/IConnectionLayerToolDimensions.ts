// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDomainDimension from "../../../../../../model/types/dimension/IMapDomainDimension";
import IMapTypeDimension from "../../../../../../model/types/dimension/IMapTypeDimension";

/**
 * This type provides the specification of the connection layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolDimensions = ILayerToolDimensions & {
    geoData: IMapDomainDimension<IGeoData>,
    from: IMapDomainDimension<IMapDataDomain>,
    to: IMapDomainDimension<IMapDataDomain>,
    direction: IMapTypeDimension<boolean>
}
export default IConnectionLayerToolDimensions;