// Geovisto core
import {
    IMapForm,
    MapObjectForm
} from '../../../../../index.core';

import ISelectionTool from '../../types/tool/ISelectionTool';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * @author Jiri Hynek
 */
class SelectionToolMapForm extends MapObjectForm<ISelectionTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: ISelectionTool) {
        super(tool);
    }

    /**
     * It returns a HTML div element conatining the form.
     */
    public getContent(): HTMLDivElement {
        if(this.htmlContent == undefined) {
            this.htmlContent = this.createContent();
        }
        return this.htmlContent;
    }

    /**
     * Help function which creates the HTML div element.
     */
    protected createContent(): HTMLDivElement {
        // tab pane
        const htmlContent = document.createElement('div');

        // TODO ... (selection settings)

        return htmlContent;
    }

}
export default SelectionToolMapForm;