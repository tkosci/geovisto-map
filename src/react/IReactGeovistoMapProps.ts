import IMapProps from "../model/types/map/IMapProps";
import IMapConfigManager from "../model/types/config/IMapConfigManager";
import ReactGeovistoMap from "./ReactGeovistoMap";
import { RefObject } from "react";

/**
 * This type provide specification of map props model.
 * 
 * @author Jiri Hynek
 */
type IReactGeovistoMapProps = IMapProps & {
    ref: RefObject<ReactGeovistoMap>,
    config: IMapConfigManager | undefined
}
export default IReactGeovistoMapProps;