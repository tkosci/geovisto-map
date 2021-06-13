import { Marker as LMarker,  Icon } from "leaflet";
import IMarker from "../../types/marker/IMarker";
import IMarkerIconOptions from "../../types/marker/IMarkerIconOptions";

/**
 * This intreface extends Leaflet Marker in order to work with generic icon type.
 * 
 * @author Jiri Hynek
 */
 class Marker<T extends Icon<IMarkerIconOptions>> extends LMarker implements IMarker<T> {

    /**
     * It sets the marker icon.
     * 
     * @param icon 
     */
    public setIcon(icon: T): this {
        return super.setIcon(icon);
    }

    /**
     * It returns the marker icon.
     */
    public getIcon(): T {
        return super.getIcon() as T;
    }
}

export default Marker;