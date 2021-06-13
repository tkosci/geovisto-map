import MapObjectDefaults from "../object/MapObjectDefaults";
import IMapToolDefaults from "../../types/tool/IMapToolDefaults";
import IMapToolConfig from "../../types/tool/IMapToolConfig";
import IMapDataManager from "../../types/data/IMapDataManager";
import MapDataManagerFactory from "../data/MapDataManagerFactory";
import GeoDataManager from "../geodata/GeoDataManager";
import IGeoDataManager from "../../types/geodata/IGeoDataManager";
import IGeoData from "../../types/geodata/IGeoData";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MapToolDefaults extends MapObjectDefaults implements IMapToolDefaults {

    /**
     * It returns default map data manager.
     */
    public getDataManager(): IMapDataManager {
        return (new MapDataManagerFactory).json([]);
    }

    /**
     * It returns default geo data manager.
     */
     public getGeoDataManager(geoDataArray: IGeoData[] | undefined): IGeoDataManager {
        return new GeoDataManager(geoDataArray ?? []);
    }

    /**
     * By defaults it returns the config with undefined props.
     */
    public getConfig(): IMapToolConfig {
        const config = <IMapToolConfig> super.getConfig();
        config.enabled = undefined;
        return config;
    }

    /**
     * By default, the tool is singleton
     */
    public isSingleton(): boolean {
       return false; 
    }

    /**
     * By default, the tool is enabled.
     */
    public isEnabled(): boolean {
        return true;
    }
}
export default MapToolDefaults;