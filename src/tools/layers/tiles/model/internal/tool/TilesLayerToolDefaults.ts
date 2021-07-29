// Geovisto core
import {
    IMapTilesModel,
    LayerToolDefaults
} from "../../../../../../index.core";

import ITilesLayerToolDefaults from "../../types/tool/ITilesLayerToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolDefaults extends LayerToolDefaults implements ITilesLayerToolDefaults {

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-tiles";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return TilesLayerToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Map layer";
    }

    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return this.getLayerName();
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-globe"></i>';
    }

    /**
     * It returns the preferred base map.
     */
    public getBaseMap(): IMapTilesModel {
        return {
            url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            //url: 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
            //url: 'https://mapserver.mapy.cz/turist-m/{z}-{x}-{y}';
            //url: 'http://mapserver.mapy.cz/base-m/{z}-{x}-{y}';
            maxZoom: 20,
            maxNativeZoom: 19
            //subdomains:['mt0','mt1','mt2','mt3']
        };
        
    }
}
export default TilesLayerToolDefaults;