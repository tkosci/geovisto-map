// Geovisto core
import {
    IMap,
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    MapTool
} from "../../../../../index.core";

import IFiltersTool from "../../types/tool/IFiltersTool";
import IFiltersToolConfig from "../../types/tool/IFiltersToolConfig";
import IFiltersToolDefaults from "../../types/tool/IFiltersToolDefaults";
import IFiltersToolProps from "../../types/tool/IFiltersToolProps";
import IFiltersToolState from "../../types/tool/IFiltersToolState";
import IMapFilterRule from "../../types/filter/IMapFilterRule";
import FiltersToolDefaults from "./FiltersToolDefaults";
import FiltersToolState from "./FiltersToolState";
import FiltersToolMapForm from "../form/FiltersToolMapForm";

// styles
import "../../../styles/style.scss";

/**
 * This class wraps filters, sidebar tab and state. It provides methods for filters management.
 * 
 * @author Jiri Hynek
 */
class FiltersTool extends MapTool implements IFiltersTool, IMapFormControl {

    /**
     * TODO: move to the state
     */
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props
     */
    public constructor(props?: IFiltersToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IFiltersTool {
        return new FiltersTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IFiltersToolProps {
        return <IFiltersToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the filters tool.
     */
    public getDefaults(): IFiltersToolDefaults {
        return <IFiltersToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): IFiltersToolDefaults {
        return new FiltersToolDefaults();
    }

    /**
     * It returns the filters tool state.
     */
    public getState(): IFiltersToolState {
        return <IFiltersToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    public createState(): IFiltersToolState {
        return new FiltersToolState(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IFiltersToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates new filter tool.
     */
    public create(): this {
        // set filter rules
        this.setFilterRules(this.getState().getFilterRules());
        return this;
    }

    /**
     * It returns a map form.
     */
    public getMapForm(): IMapForm {
        if(this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It creates new map form.
     */
    protected createMapForm(): IMapForm {
        return new FiltersToolMapForm(this);
    }

    /**
     * It updates filter rules and notifies listeners.
     * 
     * @param filterRules 
     */
    public setFilterRules(filterRules: IMapFilterRule[]): void {
        if(filterRules != undefined) {
            const map : IMap | undefined = this.getMap();
            // if the filter tool is enabled, update map data
            if(this.isEnabled() && map) {
                const mapDataManager = map.getState().getMapData();
                map.updateCurrentData(
                    this.getState().getFiltersManager().filterData(mapDataManager, mapDataManager.getDataRecords(), filterRules),
                    this);
            }

            // update filter rules
            this.getState().setFilterRules(filterRules);
        }
    }

    /**
     * It changes filters state to enabled/disabled.
     * 
     * @param enabled
     */
    public setEnabled(enabled: boolean): void {
        if(enabled != this.isEnabled()) {
            // update state
            this.getState().setEnabled(enabled);

            // the Geovisto map stores the current data and works as the event dispatcher
            const map: IMap | undefined = this.getMap();

            if(map) {
                // apply filter rules if enabled, else use empty list of filters (use the initial data)
                if(enabled) {
                    const mapData = map.getState().getMapData();
                    map.updateCurrentData(
                        this.getState().getFiltersManager().filterData(mapData, mapData.getDataRecords(), this.getState().getFilterRules()),
                        this);
                } else {
                    map.updateCurrentData(map.getState().getMapData().getDataRecords(), this);
                }
            }
        }
    }
}
export default FiltersTool;