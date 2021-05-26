import IMapObjectState from "../object/IMapObjectState";
import IMapToolConfig from "./IMapToolConfig";
import IMap from "../map/IMap";
import IMapToolDefaults from "./IMapToolDefaults";
import { IMapToolProps, IMapToolInitProps } from "./IMapToolProps";

/**
 * This interface declares the state of the map tool.
 * It wraps the state since the map tool can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
interface IMapToolState<
    TProps extends IMapToolProps = IMapToolProps,
    TDefaults extends IMapToolDefaults = IMapToolDefaults,
    TConfig extends IMapToolConfig = IMapToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapObjectState<TProps, TDefaults, TConfig> {

    /**
     * It resets the state with respect to the initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    initialize(defaults: TDefaults, props: TProps, initProps: TInitProps): void

    /**
     * It returns the enabled property of the tool state.
     */
    isEnabled(): boolean;

    /**
     * It sets the enabled property of tool state.
     * 
     * @param enabled 
     */
    setEnabled(enabled: boolean): void;

    /**
     * It returns the map property of the tool state.
     */
    getMap(): IMap | undefined;

    /**
     * It sets the map property of the tool state.
     * 
     * @param map  
     */
    setMap(map: IMap): void;
}
export default IMapToolState;