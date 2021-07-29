// Leaflet
import {
    LatLngExpression
} from "leaflet";

// Geovisto core
import {
    IGeoData,
    ILayerToolDefaults,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension
} from "../../../../../../index.core";

import IMarker from "../marker/IMarker";
import IMarkerIcon from "../marker/IMarkerIcon";
import { IMarkerIconOptions } from "../marker/IMarkerIconOptions";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";
import IMarkerOptions from "../marker/IMarkerOptions";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(map?: IMap): IMarkerLayerToolDimensions;

    /**
     * It returns the default geo data dimension.
     */
    getGeoDataDimension(map?: IMap): IMapDomainDimension<IGeoData>;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoIdDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDomainDimension<IMapAggregationFunction>;

    /**
     * It returns the default category dimension.
     */
    getCategoryDimension(map?: IMap): IMapDomainDimension<IMapDataDomain>;
    
    /**
     * It returns the default geo data.
     */
    getGeoData(): IGeoData[];

    /**
     * It returns new marker for the given options.
     * 
     * @param latlng 
     * @param options
     */
    getMarker(latlng: LatLngExpression, options?: IMarkerOptions): IMarker<IMarkerIcon<IMarkerIconOptions>>;

    /**
     * It returns new icon for the given options.
     * 
     * @param options 
     */
     getMarkerIcon(options: IMarkerIconOptions): IMarkerIcon<IMarkerIconOptions>;
}
export default IMarkerLayerToolDefaults;