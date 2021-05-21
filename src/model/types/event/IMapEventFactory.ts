import IMapObject from "../object/IMapObject";
import IMapEvent from "./IMapEvent";
import IMapChangeEvent from "./IMapChangeEvent";

/**
 * This interface declares a factory for map events.
 * 
 * @author Jiri Hynek
 */
interface IMapEventFactory {
    
    /**
     * It creates a generic event.
     */
    default(type: string, source: IMapObject): IMapEvent;
    
    /**
     * It creates a generic change event.
     */
    change(type: string, source: IMapObject, changedObject: any): IMapChangeEvent;
    
    /**
     * It creates the data change event.
     */
    dataChange(source: IMapObject, data: any): IMapChangeEvent;
}
export default IMapEventFactory;