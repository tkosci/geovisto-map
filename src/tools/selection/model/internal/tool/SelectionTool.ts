import SelectionToolState from "./SelectionToolState";
import SelectionToolEvent from "../event/SelectionToolEvent";
import SelectionToolDefaults from "./SelectionToolDefaults";
import SelectionToolMapForm from "../form/SelectionTooMapForm";
import ISelectionToolProps from "../../types/tool/ISelectionToolProps";
import IMapSelection from "../../types/selection/IMapSelection";
import ISelectionTool from "../../types/tool/ISelectionTool";
import ISelectionToolDefaults from "../../types/tool/ISelectionToolDefaults";
import ISelectionToolState from "../../types/tool/ISelectionToolState";
import MapTool from "../../../../../model/internal/tool/MapTool";
import { IMapToolInitProps } from "../../../../../model/types/tool/IMapToolProps";
import ISelectionToolConfig from "../../types/tool/ISelectionToolConfig";
import IMapEvent from "../../../../../model/types/event/IMapEvent";
import DataChangeEvent from "../../../../../model/internal/event/data/DataChangeEvent";
import MapSelection from "../selection/MapSelection";
import IMapFormControl from "../../../../../model/types/form/IMapFormControl";
import IMapForm from "../../../../../model/types/form/IMapForm";

/**
 * This class provides the selection tool.
 * 
 * TODO: exclude defaults and state variables
 * 
 * @author Jiri Hynek
 */
class SelectionTool extends MapTool implements ISelectionTool, IMapFormControl {

    /**
     * TODO: move to the tool state.
     */
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @paramps 
     */
    public constructor(props: ISelectionToolProps | undefined) {
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
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<ISelectionToolConfig>): this {
        return super.initialize(initProps);
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
            if(selection) {
                this.setSelection(new MapSelection(selection.getTool(), selection.getSrcIds()));
            }
        }
        return;
    }
}
export default SelectionTool;