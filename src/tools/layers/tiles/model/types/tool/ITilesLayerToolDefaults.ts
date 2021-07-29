// Geovisto core
import {
    ILayerToolDefaults,
    IMapTilesModel
} from "../../../../../../index.core";

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