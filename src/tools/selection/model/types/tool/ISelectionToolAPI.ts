// Geovisto core
import {
    IMapTool,
    IMapToolAPI
} from "../../../../../index.core";

import IMapSelection from "../selection/IMapSelection";

/**
 * Getter of the the Selection Tool API.
 * 
 * @author Jiri Hynek
 */
export type ISelectionToolAPIGetter = {
    getGeovistoSelectionTool: () => ISelectionToolAPI;
}

/**
 * API for Selection Tool.
 * 
 * @author Jiri Hynek
 */
export type ISelectionToolAPI = IMapToolAPI & {
    getChangeEventType: () => string,
    getSelection: () => IMapSelection | null,
    setSelection: (selection: IMapSelection | null) => void,
    createSelection: (source: IMapTool, ids: string[]) => IMapSelection;
}