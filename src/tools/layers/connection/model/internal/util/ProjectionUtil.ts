// d3
import {
    line as d3line,
    curveBundle as d3curveBundle
} from "d3";

// Leaflet
import L from "leaflet";

import IConnectionLayerNode from "../../types/items/IConnectionLayerNode";

/**
 * This class provides help functions for projections of points used in the Connection tool.
 * 
 * @author Jiri Hynek
 */
class ProjectionUtil {

    /**
     * It provides the function which projects the given node to the given leaflet map with the given zoom.
     * 
     * @param node 
     */
    public static getDataProjectionFunction(map: L.Map, zoom: number): (node: IConnectionLayerNode) => void {
        return function(node: IConnectionLayerNode): void {
            // project the [lat, lng] point to the map with the given zoom
            const coords = map.project(new L.LatLng(node.lat, node.long), zoom);
            node.x = coords.x;
            node.y = coords.y;
        };
    }

    /**
     * It provides the the d3 line function which also:
     * (1) unprojects the given point from the given leaflet map with given zoom
     * (2) projects the point of (1) to the current map state
     * 
     * @param map 
     * @param zoom 
     */
    public static getPathProjectionFunction(map: L.Map, zoom: number): d3.Line<[number, number]> {
        return d3line()
            .curve(d3curveBundle)
            //.x(function(d) { return d.x; })
            //.y(function(d) { return d.y; });
            //.x(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).x; })
            //.y(function(d) { return map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y; });

            // points need to be unprojected first
            // then they need to be projected to the current map state
            // TODO: specify the types (keep any for this purpose)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .x(function(d: any) {
                // project [lat, lng] to the current map state
                return map.latLngToLayerPoint(
                    // unproject the point to [lat,lng]
                    map.unproject(new L.Point(d.x, d.y), zoom)
                ).x;
            })
            // TODO: specify the types (keep any for this purpose)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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