// Geovisto core
import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";
import IMapTilesModel from "../../../../../../model/types/tiles/IMapTilesModel";

/**
 * This type provides the specification of the tiles layer tool props model.
 * 
 * @author Jiri Hynek
 */
type ITilesLayerToolProps = ILayerToolProps & {
    baseMap?: IMapTilesModel;
}
export default ITilesLayerToolProps;