// Leaflet
import {
    Marker
} from "leaflet";

import IMarkerIcon from "./IMarkerIcon";
import { IMarkerIconOptions } from "./IMarkerIconOptions";
import IMarkerOptions from "./IMarkerOptions";

/**
 * This intreface extends Leaflet Marker in order to work with generic icon type.
 * 
 * @author Jiri Hynek
 */
 interface IMarker<T extends IMarkerIcon<IMarkerIconOptions>> extends Marker {
    
    /**
     * It returns the marker options.
     */
    getOptions(): IMarkerOptions;

    /**
     * It sets the marker icon.
     * 
     * @param icon 
     */
    setIcon(icon: T): this;

    /**
     * It returns the marker icon.
     */
    getIcon(): T;
}

export default IMarker;