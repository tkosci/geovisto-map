import IMapDefaults from "../../types/map/IMapDefaults";
import IMapConfig from "../../types/map/IMapConfig";
import IMapConfigManager from "../../types/config/IMapConfigManager";
import IMapTemplates from "../../types/map/IMapTemplates";
import IMapToolsManager from "../../types/tool/IMapToolsManager";
import IMapDataManager from "../../types/data/IMapDataManager";
import IMapGlobals from "../../types/map/IMapGlobals";
import MapObjectDefaults from "../object/MapObjectDefaults";
import MapToolsManager from "../tool/MapToolsManager";
import MapConfigManager from "../config/basic/MapConfigManager";
import JsonMapDataManager from "../data/json/JsonMapDataManager";

// TODO: remove
import countryCentroids from '../../../../static/geo/country_centroids.json';
import countryPolygons from '../../../../static/geo/country_polygons.json';
import IMapEventManager from "../../types/event/IMapEventManager";
import MapEventManager from "../event/MapEventManager";

/**
 * This class provide functions which return the default state values.
 *
 * @author Jiri Hynek
 */
class GeovistoMapDefaults extends MapObjectDefaults implements IMapDefaults {
    
    private polygons: unknown;
    private centroids: unknown;

    /**
     * It returns default map config manager.
     */
    public getConfigManager(): IMapConfigManager {
        return new MapConfigManager({});
    }

    /**
     * It returns default map config.
     * 
     * All config variables are undefined since they might override the props.
     */
    public getConfig(): IMapConfig {
        return {
            id: undefined,
            type: undefined,
            tools: undefined,
            zoom: undefined,
            mapCenter: undefined,
            mapStructure: undefined
        };
    }

    public static TYPE = "geovisto-map";

    /**
     * It returns a unique type string of the object.
     */
    public getType(): string {
        return GeovistoMapDefaults.TYPE;
    }

    /**
     * It returns a default map event manager.
     * 
     * @returns event manager
     */
    public getEventManager(): IMapEventManager {
        return new MapEventManager();
    }

    /**
     * It returns a default managers providing templates.
     */
    public getTemplates(): IMapTemplates {
        return {
            tools: this.getToolTemplates(),
        };
    }

    /**
     * It returns a default tools manager containing used tools.
     */
    public getToolTemplates(): MapToolsManager {
        return new MapToolsManager([]);
    }

    /**
     * It returns a default tools manager containing used tools.
     */
    public getTools(): IMapToolsManager {
        return new MapToolsManager([]);
    }

    /**
     * It returns default map data manager.
     */
    public getMapData(): IMapDataManager {
        return new JsonMapDataManager([]);
    }

    /**
     * It returns default geo polygons.
     * 
     * TODO: provide a GeoJSON manager.
     */
    public getPolygons(): unknown {
        if(!this.polygons) {
            this.polygons = countryPolygons;
        }
        return this.polygons;
    }

    /**
     * It returns default geo centroids.
     * 
     * TODO: provide a GeoJSON manager.
     */
    public getCentroids(): unknown {
        if(!this.centroids) {
            this.centroids = countryCentroids;
        }
        return this.centroids;
    }

    /**
     * It returns default global state variables.
     */
    public getGlobals(): IMapGlobals {
        return {
            zoom: this.getZoom(),
            mapCenter: this.getMapCenter(),
            mapStructure: this.getMapStructure(),
        };
    }

    /**
     * It returns default zoom level.
     */
    public getZoom(): number {
        return 2;
    }

    /**
     * It returns default center coordinates in Leaflet map.
     */
    public getMapCenter(): { lat: number, lng: number } {
        return {
            lat: 50,
            lng: -0.1
        };
    }

    /**
     * It returns the map structure defined with respect to the leaflet library.
     */
    public getMapStructure(): { maxZoom: number, maxBounds: [[ number,number ],[ number,number ]] } {
        return {
            maxZoom: 10,
            maxBounds: [[-100,-400],[2000,400]]
        };
    }
}
export default GeovistoMapDefaults;
