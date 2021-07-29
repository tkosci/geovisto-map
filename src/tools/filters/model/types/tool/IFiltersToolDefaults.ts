// Geovisto core
import {
    IMapToolDefaults
} from "../../../../../index.core";

import IFiltersToolConfig from "./IFiltersToolConfig";
import IMapFilterManager from "../filter/IMapFilterManager";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IFiltersToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IFiltersToolConfig;

    /**
     * It returns default filters manager.
     */
    getFiltersManager(): IMapFilterManager;

    /**
     * It returns default filter rules.
     */
    getFilterRules(): IMapFilterRule[];
}
export default IFiltersToolDefaults;