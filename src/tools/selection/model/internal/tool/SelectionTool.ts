// Geovisto core
import {
    DataChangeEvent,
    IMapDataChangeEvent,
    IMapEvent,
    IMapForm,
    IMapFormControl,
    IMapTool,
    IMapToolInitProps,
    MapTool
} from "../../../../../index.core";

import IMapSelection from "../../types/selection/IMapSelection";
import ISelectionTool from "../../types/tool/ISelectionTool";
import { ISelectionToolAPI, ISelectionToolAPIGetter } from "../../types/tool/ISelectionToolAPI";
import ISelectionToolConfig from "../../types/tool/ISelectionToolConfig";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";
import ISelectionToolProps from "../../types/tool/ISelectionToolProps";
import ISelectionToolState from "../../types/tool/ISelectionToolState";
import MapSelection from "../selection/MapSelection";
import SelectionToolAPI from "./SelectionToolAPI";
import SelectionToolDefaults from "./SelectionToolDefaults";
import SelectionToolEvent from "../event/SelectionToolEvent";
import SelectionToolMapForm from "../form/SelectionTooMapForm";
import SelectionToolState from "./SelectionToolState";

/**
 * This class provides the selection tool.
 * 
 * @author Jiri Hynek
 */
class SelectionTool extends MapTool implements ISelectionTool, IMapFormControl {

    /**
     * tool api
     */
    private static api: ISelectionToolAPI = SelectionToolAPI;

    /**
     * TODO: move to the tool state.
     */
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @paramps 
     */
    public constructor(props?: ISelectionToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ISelectionTool {
        return new SelectionTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): ISelectionToolProps {
        return <ISelectionToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the selection tool.
     */
    public getDefaults(): ISelectionToolDefaults {
        return <ISelectionToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    public createDefaults(): ISelectionToolDefaults {
        return new SelectionToolDefaults();
    }

    /**
     * It returns the selection tool state.
     */
    public getState(): ISelectionToolState {
        return <ISelectionToolState> super.getState();
    }

    /**
     * It creates the tool state.
     */
    public createState(): ISelectionToolState {
        return new SelectionToolState(this);
    }

    /**
     * It returns the tool API
     */
    public getAPIGetter(): ISelectionToolAPIGetter | undefined {
        return {
            getGeovistoSelectionTool: () => SelectionTool.api
        };
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<ISelectionToolConfig>): this {
        this.initializeAPI();
        return super.initialize(initProps);
    }

    /**
     * Help method which initializes the API.
     */
    protected initializeAPI(): void {
        // use this tool reference in API (this tool should be used as a singleton)
        SelectionTool.api.getSelection = () => this.getState().getSelection();
        SelectionTool.api.createSelection = (source: IMapTool, ids: string[]) => new MapSelection(source, ids);
        SelectionTool.api.setSelection = (selection: IMapSelection | null) => this.setSelection(selection);
    }

    /**
     * It creates new filter tool.
     */
    public create(): this {
        // set selection
        // not necessary
        //this.setSelection(this.getState().getSelection());
        return this;
    }

    /**
     * 
     * @paramection 
     */
    public setSelection(selection: IMapSelection | null): void {
        // if the selection tool is enabled, update map selection
        if(this.isEnabled()) {
            // update tool state
            this.getState().setSelection(selection);

            // dispatch event
            this.getMap()?.getState().getEventManager().scheduleEvent(new SelectionToolEvent(this, selection), undefined, undefined);
        }
    }

    /**
     * It returns a tab fragment.
     */
    public getMapForm(): IMapForm {
        if(this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It creates new tab control.
     */
    protected createMapForm(): IMapForm {
        return new SelectionToolMapForm(this);
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == DataChangeEvent.TYPE()) {
            // if data has been changed reset the selection
            const selection = this.getState().getSelection();
            if((<IMapDataChangeEvent> event).getAnimateOptions()) {
                if(selection) {
                    this.setSelection(null);
                }
            } else {
                if(selection) {
                    this.setSelection(new MapSelection(selection.getTool(), selection.getSrcIds()));
                }
            }
        }
        return;
    }
}
export default SelectionTool;