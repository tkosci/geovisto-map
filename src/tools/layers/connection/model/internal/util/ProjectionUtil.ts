import * as d3 from "d3";
import L from "leaflet";

/**
 * This class provides help functions for projections of points used in the Connection tool.
 * 
 * @author Jiri Hynek
 */
class ProjectionUtil {

    /**
     * It provides the function which projects the given point to the given leaflet map with the given zoom.
     * 
     * TODO: specify the types
     * 
     * @param d 
     */
    public static getDataProjectionFunction(map: L.Map, zoom: number): (d: { lat: number, long: number, x: number, y: number }) => void {
        return function(d: { lat: number, long: number, x: number, y: number }): void {
            // project the [lat, lng] point to the map with the given zoom
            const coords = map.project(new L.LatLng(d.lat, d.long), zoom);
            d.x = coords.x;
            d.y = coords.y;
        };
    }

    /**
     * It provides the the d3 line function which also:
     * (1) unprojects the given point from the given leaflet map with given zoom
     * (2) projects the point of (1) to the current map state
     * 
     * TODO: specify the types
     * 
     * @param map 
     * @param zoom 
     */
    public static getPathProjectionFunction(map: L.Map, zoom: number): d3.Line<[number, number]> {
        return d3.line()
            .curve(d3.curveBundle)
            //.x(function(d) { return d.x; })
            //.y(function(d) { return d.y; });
            //.x(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).x; })
            //.y(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y; });

            // points need to be unprojected first
            // then they need to be projected to the current map state
            // TODO: specify the types
            .x(function(d: any) {
                // project [lat, lng] to the current map state
                return map.latLngToLayerPoint(
                    // unproject the point to [lat,lng]
                    map.unproject(new L.Point(d.x, d.y), zoom)
                ).x;
            })
            // TODO: specify the types
            .y(function(d: any) {
                // project [lat, lng] to the current map state
                return map.latLngToLayerPoint(
                    // unproject the point to [lat,lng]
                    map.unproject(new L.Point(d.x, d.y), zoom)
                ).y;
            });
    }
}
export default ProjectionUtil;