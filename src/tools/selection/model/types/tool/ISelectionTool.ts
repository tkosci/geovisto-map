// Geovisto core
import {
    IMapTool,
    IMapToolInitProps
} from "../../../../../index.core";

import IMapSelection from "../selection/IMapSelection";
import { ISelectionToolAPI } from "./ISelectionToolAPI";
import ISelectionToolConfig from "./ISelectionToolConfig";
import ISelectionToolDefaults from "./ISelectionToolDefaults";
import ISelectionToolProps from "./ISelectionToolProps";
import ISelectionToolState from "./ISelectionToolState";

/**
 * This interface declares the selection tool.
 * 
 * @author Jiri Hynek
 */
interface ISelectionTool<
    TProps extends ISelectionToolProps = ISelectionToolProps,
    TDefaults extends ISelectionToolDefaults = ISelectionToolDefaults,
    TState extends ISelectionToolState = ISelectionToolState,
    TConfig extends ISelectionToolConfig = ISelectionToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>,
    TAPI extends ISelectionToolAPI = ISelectionToolAPI
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps, TAPI> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ISelectionTool;

    /**
     * It updates selection and notifies listeners.
     * 
     * @param
     */
    setSelection(selection: IMapSelection | null): void;
}
export default ISelectionTool;