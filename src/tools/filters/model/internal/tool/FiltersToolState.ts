// Geovisto core
import {
    IMapDataDomain,
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import IFiltersToolState from "../../types/tool/IFiltersToolState";
import IFiltersTool from "../../types/tool/IFiltersTool";
import IMapFilterRule from "../../types/filter/IMapFilterRule";
import IMapFilterManager from "../../types/filter/IMapFilterManager";
import IFiltersToolConfig from "../../types/tool/IFiltersToolConfig";
import IFiltersToolProps from "../../types/tool/IFiltersToolProps";
import IFiltersToolDefaults from "../../types/tool/IFiltersToolDefaults";

/**
 * This class provide functions for using filters.
 * 
 * @author Jiri Hynek
 */
class FiltersToolState extends MapToolState implements IFiltersToolState {
    
    private rules!: IMapFilterRule[];
    private manager!: IMapFilterManager;

    /**
     * It creates a tool state.
     * 
     * @param tool
     */
    public constructor(tool: IFiltersTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     */
    public initialize(defaults: IFiltersToolDefaults, props: IFiltersToolProps, initProps: IMapToolInitProps<IFiltersToolConfig>): void {
        // set filter manager, which manages filter operations
        this.setFiltersManager(props.manager == undefined ? defaults.getFiltersManager() : props.manager);

        // set filter rules if specified in props explicitly
        this.setFilterRules(props.rules == undefined ? defaults.getFilterRules() : props.rules);

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IFiltersToolConfig): void {
        super.deserialize(config);

        // deserialize filter rules
        if(config.filterRules) {
            // get filter and data manegers which are need for proper deserialization of filter rules
            const filterManager = this.getFiltersManager();
            const mapDataManager = this.getMap()?.getState().getMapData();
            if(filterManager && mapDataManager) {
                const filterRules: IMapFilterRule[] = [];
                let configFilterRule;
                let dataDomain: IMapDataDomain | undefined;
                let filterRule: IMapFilterRule | null;
                for(let i = 0; i < config.filterRules.length; i++) {
                    configFilterRule = config.filterRules[i];
                    // get data domain
                    dataDomain = mapDataManager.getDomain(configFilterRule.domain);
                    if(dataDomain && configFilterRule.operation && configFilterRule.pattern) {
                        filterRule = filterManager.createRule(dataDomain, configFilterRule.operation, configFilterRule.pattern);
                        if(filterRule) {
                            filterRules.push(filterRule);
                        }
                    }
                }
                this.setFilterRules(filterRules);
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IFiltersToolDefaults | undefined): IFiltersToolConfig {
        const config: IFiltersToolConfig = <IFiltersToolConfig> super.serialize(defaults);

        // serialize filter filters
        if(this.rules != undefined) {
            config.filterRules = [];
            let filterRule;
            for(let i = 0; i < this.rules.length; i++) {
                filterRule = this.rules[i];
                config.filterRules.push({
                    domain: filterRule.getDataDomain().getName(),
                    operation: filterRule.getFilterOperation().toString(),
                    pattern: filterRule.getPattern()
                });
            }
        }

        return config;
    }

    /**
     * It returns filter manager
     */
    public getFiltersManager(): IMapFilterManager {
        return this.manager;
    }

    /**
     * It updates filter manager.
     * 
     * @param manager
     */
    public setFiltersManager(manager: IMapFilterManager): void {
        this.manager = manager;
    }

    /**
     * It returns the filterRules property of the tool state.
     */
    public getFilterRules(): IMapFilterRule[] {
        return this.rules;
    }

    /**
     * It sets the filterRules property of the tool state.
     * 
     * @param filterRules
     */
    public setFilterRules(filterRules: IMapFilterRule[]): void {
        this.rules = filterRules;
    }
}
export default FiltersToolState;