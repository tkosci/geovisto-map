import IMapObjectConfig from "../object/IMapObjectConfig";
import IMapToolConfig from "../tool/IMapToolConfig";

/**
 * This type provides specification of map config model.
 * 
 * @author Jiri Hynek
 */
type IMapConfig = IMapObjectConfig & {
    zoom: number | undefined;
    mapCenter: { lat: number, lng: number } | undefined;
    mapStructure: { maxZoom: number, maxBounds: [[ number, number ],[ number, number ]] } | undefined;
    tools: IMapToolConfig[] | undefined;
}
export default IMapConfig;