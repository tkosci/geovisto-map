// Geovisto core
import {
    IMapTool
} from "../../../../../index.core";

import IMapSelection from "../../types/selection/IMapSelection";
import { ISelectionToolAPI } from "../../types/tool/ISelectionToolAPI";
import MapSelection from "../selection/MapSelection";
import SelectionToolDefaults from "./SelectionToolDefaults";
import SelectionToolEvent from "../event/SelectionToolEvent";

/**
 * API for Selection Tool.
 * 
 * @author Jiri Hynek
 */
const SelectionToolAPI: ISelectionToolAPI = {
    getType: () => SelectionToolDefaults.TYPE,
    getSelection: () => null,
    getChangeEventType: () => SelectionToolEvent.TYPE(),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setSelection: (selection: IMapSelection | null) => { return; },
    createSelection: (source: IMapTool, ids: string[]) => new MapSelection(source, ids)
};
export default SelectionToolAPI;