import IMapProps from "../model/types/map/IMapProps";
import IMapConfigManager from "../model/types/config/IMapConfigManager";
import ReactGeovistoMap from "./ReactGeovistoMap";
import { RefObject } from "react";

/**
 * This interface provide specification of map props model.
 * 
 * @author Jiri Hynek
 */
interface IReactGeovistoMapProps extends IMapProps {
    ref: RefObject<ReactGeovistoMap>,
    config: IMapConfigManager | undefined
}
export default IReactGeovistoMapProps;