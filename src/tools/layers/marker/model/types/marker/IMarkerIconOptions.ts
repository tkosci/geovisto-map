// Leaflet
import {
    BaseIconOptions
} from "leaflet";

/**
 * The definition of type describing marker icon options.
 * 
 * @author Jiri Hynek
 */
type IMarkerIconOptions = BaseIconOptions & {
    values: {
        id: string,
        value: number,
        subvalues: Map<string, number>
    };
    isGroup: boolean;
    useDonut: boolean;
}
export default IMarkerIconOptions;