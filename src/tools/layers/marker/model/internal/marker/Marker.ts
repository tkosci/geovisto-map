// Leaflet
import {
    LatLngExpression,
    Marker as LMarker
} from "leaflet";

import IMarker from "../../types/marker/IMarker";
import IMarkerIcon from "../../types/marker/IMarkerIcon";
import { IMarkerIconOptions } from "../../types/marker/IMarkerIconOptions";
import IMarkerOptions from "../../types/marker/IMarkerOptions";

/**
 * This intreface extends Leaflet Marker in order to work with generic icon type.
 * 
 * @author Jiri Hynek
 */
 class Marker<T extends IMarkerIcon<IMarkerIconOptions>> extends LMarker implements IMarker<T> {

    public constructor(latlng: LatLngExpression, options?: IMarkerOptions) {
        super(latlng, options);
    }

    /**
     * It returns the marker options.
     */
    public getOptions(): IMarkerOptions {
        return this.options as IMarkerOptions;
    }

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