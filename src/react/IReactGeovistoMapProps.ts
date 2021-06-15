import { IMapProps } from "../model/types/map/IMapProps";
import IMapConfigManager from "../model/types/config/IMapConfigManager";
import ReactGeovistoMap from "./ReactGeovistoMap";
import { RefObject } from "react";

/**
 * This type provides the specification of the map props model.
 * 
 * @author Jiri Hynek
 */
type IReactGeovistoMapProps = IMapProps & {
    ref: RefObject<ReactGeovistoMap>,
    config?: IMapConfigManager
}
export default IReactGeovistoMapProps;