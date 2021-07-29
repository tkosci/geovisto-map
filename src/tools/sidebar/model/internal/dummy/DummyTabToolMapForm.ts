// Geovisto core
import {
    IMapForm,
    MapObjectForm
} from "../../../../../index.core";

import IDummyTabTool from "../../types/dummy/IDummyTabTool";

/**
 * This class provides the settings sidebar tab.
 * 
 * @author Jiri Hynek
 */
class DummyTabToolMapForm extends MapObjectForm<IDummyTabTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IDummyTabTool) {
        super(tool);
    }

    /**
     * It returns generic layer tab pane.
     */
    public getContent(): HTMLDivElement {
        if(this.htmlContent == undefined) {
            // tab pane contains empty div element
            this.htmlContent = document.createElement('div');

            // it provides empty tab - tab fragments can be appended
        }

        return this.htmlContent; 
    }

}
export default DummyTabToolMapForm;