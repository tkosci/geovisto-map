// Geovisto core
import {
    MapToolDefaults
} from "../../../../../index.core";

import IFiltersToolConfig from "../../types/tool/IFiltersToolConfig";
import IFiltersToolDefaults from "../../types/tool/IFiltersToolDefaults";
import IMapFilterManager from "../../types/filter/IMapFilterManager";
import IMapFilterRule from "../../types/filter/IMapFilterRule";
import EqFilterOperation from "../filter/custom/EqFilterOperation";
import NeqFilterOperation from "../filter/custom/NeqFilterOperation";
import RegFilterOperation from "../filter/custom/RegFilterOperation";
import MapFiltersManager from "../filter/basic/MapFiltersManager";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class FiltersToolDefaults extends MapToolDefaults implements IFiltersToolDefaults {
    
    /**
     * It returns default config if no config is given.
     */
    public getConfig(): IFiltersToolConfig {
        const config = <IFiltersToolConfig> super.getConfig();
        config.filterRules = undefined;
        return config;
    }

    /**
     * Only one filter tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-filters";

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return FiltersToolDefaults.TYPE;
    }

    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return "Filters";
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-filter"></i>';
    }

    /**
     * It returns default filters manager.
     */
    public getFiltersManager(): IMapFilterManager {
        return new MapFiltersManager([
            new EqFilterOperation(),
            new NeqFilterOperation(),
            new RegFilterOperation()
        ]);
    }

    /**
     * It returns default filter rules.
     */
    public getFilterRules(): IMapFilterRule[] {
        return [];
    }
}
export default FiltersToolDefaults;