// Leaflet
import {
    MarkerOptions
} from "leaflet";

/**
 * The definition of type describing marker options.
 * 
 * @author Jiri Hynek
 */
export type IMarkerOptions = MarkerOptions & {
    id: string,
    name: string
}
export default IMarkerOptions;