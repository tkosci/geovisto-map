// Leaflet
import {
    Icon,
} from "leaflet";

// Geovisto core
import {
    IDataChangeAnimateOptions
} from "../../../../../../index.core";

import { IMarkerIconOptions, IMarkerIconValueOptions } from "./IMarkerIconOptions";

/**
 * This intreface extends Leaflet Icon in order to work with generic icon type.
 * 
 * @author Jiri Hynek
 */
interface IMarkerIcon<T extends IMarkerIconOptions> extends Icon<T> {

    /**
     * It updates the data of the marker icon.
     * 
     * @param values 
     * @param animateOptions 
     */
    updateData(values: IMarkerIconValueOptions, animateOptions: IDataChangeAnimateOptions): void;
}

export default IMarkerIcon;