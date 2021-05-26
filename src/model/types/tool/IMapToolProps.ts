import { IMapObjectProps, IMapObjectInitProps } from "../object/IMapObjectProps";
import IMapToolConfig from "./IMapToolConfig";
import { IMap } from "../../..";

/**
 * This type provides the specification of the map tool props model.
 * 
 * @author Jiri Hynek
 */
type IMapToolProps = IMapObjectProps & {
    enabled: boolean | undefined
}

/**
 * This type provides the specification of the map tool props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type IMapToolInitProps<TConfig extends IMapToolConfig = IMapToolConfig> = IMapObjectInitProps<TConfig> & {
    map : IMap;
}
export type { IMapToolProps, IMapToolInitProps };