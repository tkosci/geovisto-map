// Leaflet
import {
    BaseIconOptions
} from "leaflet";

/**
 * The definition of type describing marker icon options.
 * 
 * @author Jiri Hynek
 */
export type IMarkerIconOptions = BaseIconOptions & {
    id: string;
    values: IMarkerIconValueOptions;
    isGroup: boolean;
    useDonut: boolean;
    categories: string[];
}

/**
 * The definition of type describing marker icon value options.
 * 
 * @author Jiri Hynek
 */
export type IMarkerIconValueOptions = {
    value: number;
    subvalues: Map<string, number>;
}