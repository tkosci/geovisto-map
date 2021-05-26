import IMapObjectConfig from "./IMapObjectConfig";

/**
 * This type provides the specification of the map object props model.
 * 
 * @author Jiri Hynek
 */
type IMapObjectProps = {
    id : string | undefined;
}

/**
 * This type provides the specification of the map object props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type IMapObjectInitProps<TConfig extends IMapObjectConfig = IMapObjectConfig> = {
    config : TConfig | undefined;
}
export type { IMapObjectProps, IMapObjectInitProps };