// Geovisto core
import {
    BooleanTypeManager,
    IGeoData,
    IMap,
    IMapDataDomain,
    IMapDomainDimension,
    IMapTypeDimension,
    LayerToolDefaults,
    MapDynamicDomainDimension,
    MapTypeDimension
} from "../../../../../../index.core";

import IConnectionLayerToolDefaults from "../../types/tool/IConnectionLayerToolDefaults";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
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
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return this.getLayerName();
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-road"></i>';
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): IConnectionLayerToolDimensions {
        return {
            geoData: this.getGeoDataDimension(map),
            from: this.getFromDimension(map),
            to: this.getToDimension(map),
            direction: this.getDirectionDimension()
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDataDimension(map?: IMap): IMapDomainDimension<IGeoData> {
        return new MapDynamicDomainDimension(
            "geo data",
            () => map?.getState().getGeoDataManager() ?? this.getGeoDataManager(this.getGeoData()),
            ""
        );
    }

    /**
     * It returns the source geo ID dimension.
     */
    public getFromDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "from",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    /**
     * It returns the target geo ID dimension.
     */
    public getToDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "to",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    /**
     * It returns the animate direction dimension.
     */
    public getDirectionDimension(): IMapTypeDimension<boolean> {
        return new MapTypeDimension<boolean>(
            "direction",
            new BooleanTypeManager(),
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