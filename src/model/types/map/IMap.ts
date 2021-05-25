import IMapObject from "../object/IMapObject";
import IMapEvent from "../event/IMapEvent";
import IMapConfigManager from "../config/IMapConfigManager";
import IMapDefaults from "./IMapDefaults";
import IMapProps from "./IMapProps";
import IMapState from "./IMapState";
import IMapData from "../data/IMapData";
import IMapConfig from "./IMapConfig";

/**
 * Declaration of map wrapper which handles map inputs (data, props, config), map tools and other map objects.
 * 
 * @author Jiri Hynek
 */
interface IMap extends IMapObject {

    /**
     * It returns object defaults as the map defaults.
     */
    getDefaults(): IMapDefaults;

    /**
     * It returns object state as the map state.
     */
    getState(): IMapState;

    /**
     * The function draws a new map.
     */
    draw(mapConfig: IMapConfigManager): HTMLElement | null;

    /**
     * This function redraws the current map.
     */
    redraw(mapConfig: IMapConfigManager, props: IMapProps): HTMLElement | null;

    /**
     * It resets the state to the initial state.
     */
    initialize(initProps: { config: IMapConfig | undefined, configManager: IMapConfigManager }): IMap;

    /**
     * It exports the serialized representation of the current state of the map.
     */
    export(): Record<string, unknown>;

    /**
     * It updates data and invokes listeners.
     * 
     * @param data
     * @param source of the change
     */
    updateData(data: IMapData, source: IMapObject): void;
    
    /**
     * It sends custom event to all listeners (tools)
     * 
     * @param event 
     */
    dispatchEvent(event: IMapEvent): void;
}
export default IMap;