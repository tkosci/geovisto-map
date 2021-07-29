// Geovisto core
import {
    IMapTool,
    IMapToolInitProps
} from "../../../../../index.core";

import IFiltersToolConfig from "./IFiltersToolConfig";
import IFiltersToolDefaults from "./IFiltersToolDefaults";
import IFiltersToolProps from "./IFiltersToolProps";
import IFiltersToolState from "./IFiltersToolState";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This interface declares the  filter tool.
 * It provides methods for filters management.
 * 
 * @author Jiri Hynek
 */
interface IFiltersTool<
    TProps extends IFiltersToolProps = IFiltersToolProps,
    TDefaults extends IFiltersToolDefaults = IFiltersToolDefaults,
    TState extends IFiltersToolState = IFiltersToolState,
    TConfig extends IFiltersToolConfig = IFiltersToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps>  {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IFiltersTool;

    /**
     * It updates filter rules and notifies listeners.
     * 
     * @param filterRules 
     */
    setFilterRules(filterRules: IMapFilterRule[]): void;
}
export default IFiltersTool;