import IMapConfigManager from "../../types/config/IMapConfigManager";
import MapConfigManager from "./basic/MapConfigManager";
import IMapConfigManagerFactory from "../../types/config/IMapConfigManagerFactory";

/**
 * This class provides a factory for config managers.
 * 
 * @author Jiri Hynek
 */
class MapConfigManagerFactory implements IMapConfigManagerFactory {
    
    /**
     * It creates the default config manager function.
     */
    public default(config: any): IMapConfigManager {
        return new MapConfigManager(config);
    }
}
export default MapConfigManagerFactory;