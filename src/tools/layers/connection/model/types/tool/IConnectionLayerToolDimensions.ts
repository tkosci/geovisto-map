import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";

/**
 * This interface provide specification of the connection layer tool dimensions model.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolDimensions extends ILayerToolDimensions {
    from: IMapDimension<IMapDataDomain>,
    to: IMapDimension<IMapDataDomain>,
}
export default IConnectionLayerToolDimensions;