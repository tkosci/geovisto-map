import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";

/**
 * This type provide specification of the connection layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerToolDimensions = ILayerToolDimensions & {
    from: IMapDimension<IMapDataDomain>,
    to: IMapDimension<IMapDataDomain>,
}
export default IConnectionLayerToolDimensions;