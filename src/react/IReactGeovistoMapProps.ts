// React
import {
    RefObject
} from "react";

// Geovisto
import IMapConfigManager from "../model/types/config/IMapConfigManager";
import { IMapProps } from "../model/types/map/IMapProps";

import ReactGeovistoMap from "./ReactGeovistoMap";

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