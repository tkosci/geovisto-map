import IMapObject from "../../../types/object/IMapObject";
import IMapChangeEvent from "../../../types/event/IMapChangeEvent";
import MapChangeEvent from "../generic/MapChangeEvent";
import IMapDataManager from "../../../types/data/IMapDataManager";

/**
 * This class provides the data change event object.
 * 
 * @author Jiri Hynek
 */
class DataManagerChangeEvent<TSource extends IMapObject> extends MapChangeEvent<TSource, IMapDataManager> implements IMapChangeEvent {

    /**
     * It initializes event.
     */
    public constructor(source: TSource, data: IMapDataManager) {
        super(DataManagerChangeEvent.TYPE(), source, data);
    }

    /**
     * Type of the event.
     */
    public static TYPE(): string {
        return "data-manager-change-event";
    }
}
export default DataManagerChangeEvent;