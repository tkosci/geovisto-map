import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import IFiltersToolConfig from "./IFiltersToolConfig";
import IMapFiltersManager from "../filter/IMapFilterManager";
import IMapFilterRule from "../filter/IMapFilterRule";
import IFiltersToolDefaults from "./IFiltersToolDefaults";
import IFiltersToolProps from "./IFiltersToolProps";

/**
 * This indetrface declares functions for using filters.
 * 
 * @author Jiri Hynek
 */
interface IFiltersToolState<
    TProps extends IFiltersToolProps = IFiltersToolProps,
    TDefaults extends IFiltersToolDefaults = IFiltersToolDefaults,
    TConfig extends IFiltersToolConfig = IFiltersToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns filter manager
     */
    getFiltersManager(): IMapFiltersManager;

    /**
     * It updates filter manager.
     * 
     * @param manager 
     */
    setFiltersManager(manager: IMapFiltersManager): void;

    /**
     * It returns the filterRules property of the tool state.
     */
    getFilterRules(): IMapFilterRule[];

    /**
     * It sets the filterRules property of the tool state.
     * 
     * @param filterRules 
     */
    setFilterRules(filterRules: IMapFilterRule[]): void;
}
export default IFiltersToolState;