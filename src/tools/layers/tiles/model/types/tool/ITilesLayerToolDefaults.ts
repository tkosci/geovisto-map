// Geovisto core
import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IMapTilesModel from "../../../../../../model/types/tiles/IMapTilesModel";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the preferred base map.
     */
    getBaseMap(): IMapTilesModel;
}
export default ITilesLayerToolDefaults;