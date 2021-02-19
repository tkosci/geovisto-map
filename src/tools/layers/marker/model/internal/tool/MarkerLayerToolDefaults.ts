// Leaflet
import {
    Icon,
    LatLngExpression,
    MarkerOptions
} from "leaflet";

// Geovisto core
import CountAggregationFunction from "../../../../../../model/internal/aggregation/basic/CountAggregationFunction";
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import IMap from "../../../../../../model/types/map/IMap";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import SumAggregationFunction from "../../../../../../model/internal/aggregation/basic/SumAggregationFunction";

import IMarker from "../../types/marker/IMarker";
import IMarkerIconOptions from "../../types/marker/IMarkerIconOptions";
import IMarkerLayerToolDefaults from "../../types/tool/IMarkerLayerToolDefaults";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import Marker from "../marker/Marker";
import { MarkerIcon } from "../marker/MarkerIcon";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolDefaults extends LayerToolDefaults implements IMarkerLayerToolDefaults {

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-marker";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return MarkerLayerToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Marker layer";
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
        return '<i class="fa fa-map-marker"></i>';
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): IMarkerLayerToolDimensions {
        return {
            geoData: this.getGeoDataDimension(map),
            geoId: this.getGeoIdDimension(map),
            value: this.getValueDimension(map),
            aggregation: this.getAggregationDimension(),
            category: this.getCategoryDimension(map)
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDataDimension(map?: IMap): IMapDimension<IGeoData> {
        return new MapDimension(
            "geo-data",
            map?.getState().getGeoDataManager() ?? this.getGeoDataManager(this.getGeoData()),
            undefined
        );
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoIdDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "geo",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default value dimension.
     */
    public getValueDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "value",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default aggregation function dimension.
     */
    public getAggregationDimension(): IMapDimension<IMapAggregationFunction> {
        const domainManager = new MapDomainArrayManager(
            [
                new CountAggregationFunction(),
                new SumAggregationFunction()
            ]
        );

        return new MapDimension(
            "aggregation",
            domainManager,
            domainManager.getDefault()
        );
    }

    /**
     * It returns the default category dimension.
     */
    public getCategoryDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "category",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }
    
    /**
     * It returns the default geo data.
     */
    public getGeoData(): IGeoData[] {
        return [
            // TODO: provide default geo data
        ];
    }

    /**
     * It returns new marker for the given options.
     * 
     * @param latlng 
     * @param options
     */
    public getMarker(latlng: LatLngExpression, options?: MarkerOptions): IMarker<Icon<IMarkerIconOptions>> {
        return new Marker<Icon<IMarkerIconOptions>>(latlng, options);
    }

    /**
     * It returns new icon for the given options.
     * 
     * @param options 
     */
    public getMarkerIcon(options: IMarkerIconOptions): Icon<IMarkerIconOptions> {
        return new MarkerIcon(options);
    }
}
export default MarkerLayerToolDefaults;