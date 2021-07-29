// Geovisto core
import {
    IMapToolState
} from "../../../../../index.core";

import IMapSelection from "../selection/IMapSelection";
import ISelectionToolConfig from "./ISelectionToolConfig";
import ISelectionToolDefaults from "./ISelectionToolDefaults";
import ISelectionToolProps from "./ISelectionToolProps";

/**
 * This interface declares functions for using selections.
 * 
 * @author Jiri Hynek
 */
interface ISelectionToolState<
    TProps extends ISelectionToolProps = ISelectionToolProps,
    TDefaults extends ISelectionToolDefaults = ISelectionToolDefaults,
    TConfig extends ISelectionToolConfig = ISelectionToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns the selection property of the tool state.
     */
    getSelection(): IMapSelection | null;

    /**
     * It sets the selection property of the tool state.
     * 
     * @param selection
     */
    setSelection(selection: IMapSelection | null): void;
}
export default ISelectionToolState;