// Geovisto core
import {
    IMapForm,
    IMapFormControl,
    IMapTool,
    IMapToolProps,
    MapTool
} from "../../../../../index.core";

import DummyTabToolMapForm from "./DummyTabToolMapForm";
import IDummyTabTool from "../../types/dummy/IDummyTabTool";

/**
 * This class represents dummy tool which provides empty map form. It provides empty sidebar which can be used be other tools via tab fragments.
 * 
 * @author Jiri Hynek
 */
class DummyTabTool extends MapTool implements IDummyTabTool, IMapFormControl {
    
    private sidebarTab!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props?: IMapToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IMapTool {
        return new DummyTabTool(this.getProps());
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getMapForm(): IMapForm {
        if(this.sidebarTab == undefined) {
            this.sidebarTab = this.createMapForm();
        }
        return this.sidebarTab;
    }

    /**
     * It creates new tab control.
     */
    protected createMapForm(): IMapForm {
        // override if needed
        return new DummyTabToolMapForm(this);
    }
}
export default DummyTabTool;