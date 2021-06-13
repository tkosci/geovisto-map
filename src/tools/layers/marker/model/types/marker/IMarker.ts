import { Icon, Marker } from "leaflet";
import IMarkerIconOptions from "./IMarkerIconOptions";

/**
 * This intreface extends Leaflet Marker in order to work with generic icon type.
 * 
 * @author Jiri Hynek
 */
 interface IMarker<T extends Icon<IMarkerIconOptions>> extends Marker {

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