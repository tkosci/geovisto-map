import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import IConnectionLayerToolDefaults from "../../types/tool/IConnectionLayerToolDefaults";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import IMap from "../../../../../../model/types/map/IMap";
import IGeoData from "../../../../../../model/types/geodata/IGeoData";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolDefaults extends LayerToolDefaults implements IConnectionLayerToolDefaults {

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-connection";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return ConnectionLayerToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Connection layer";
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): IConnectionLayerToolDimensions {
        return {
            geoData: this.getGeoDataDimension(map),
            from: this.getFromDimension(map),
            to: this.getToDimension(map),
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDataDimension(map?: IMap): IMapDimension<IGeoData> {
        return new MapDimension(
            "geo data",
            map?.getState().getGeoDataManager() ?? this.getGeoDataManager(this.getGeoData()),
            undefined
        );
    }

    /**
     * It returns the source geo ID dimension.
     */
    public getFromDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "from",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the target geo ID dimension.
     */
    public getToDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "to",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }
    
    /**
     * It returns optiomal zoom for D3 projections.
     */
    public getProjectionZoom(): number {
        return 2;
    }
    
    /**
     * It returns the default geo data.
     */
    public getGeoData(): IGeoData[] {
        return [
            // TODO: provide default geo data
        ];
    }
}
export default ConnectionLayerToolDefaults;