// Geovisto core
import {
    IGeoData,
    ILayerToolDimensions,
    IMapDataDomain,
    IMapDomainDimension,
    IMapTypeDimension
} from "../../../../../../index.core";

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