import ISettingsTool from "../../types/tool/ISettingsTool";
import MapObjectForm from "../../../../../model/internal/form/MapObjectForm";
import IMapForm from "../../../../../model/types/form/IMapForm";

/**
 * This class provides the settings sidebar tab.
 * 
 * @author Jiri Hynek
 */
class SettingsToolMapForm extends MapObjectForm<ISettingsTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: ISettingsTool) {
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
export default SettingsToolMapForm;