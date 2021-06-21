// Leaflet
import {
    Icon,
    LatLngExpression,
    MarkerOptions
} from "leaflet";

// Geovisto core
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IMap from "../../../../../../model/types/map/IMap";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";

import IMarker from "../marker/IMarker";
import IMarkerIconOptions from "../marker/IMarkerIconOptions";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";


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
    getGeoDataDimension(map?: IMap): IMapDimension<IGeoData>;

    /**
     * It returns the default geo ID dimension.
     */
    getGeoIdDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getValueDimension(map?: IMap): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default aggregation function dimension.
     */
    getAggregationDimension(): IMapDimension<IMapAggregationFunction>;

    /**
     * It returns the default category dimension.
     */
    getCategoryDimension(map?: IMap): IMapDimension<IMapDataDomain>;
    
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
    getMarker(latlng: LatLngExpression, options?: MarkerOptions): IMarker<Icon<IMarkerIconOptions>>;

    /**
     * It returns new icon for the given options.
     * 
     * @param options 
     */
     getMarkerIcon(options: IMarkerIconOptions): Icon<IMarkerIconOptions>;
}
export default IMarkerLayerToolDefaults;