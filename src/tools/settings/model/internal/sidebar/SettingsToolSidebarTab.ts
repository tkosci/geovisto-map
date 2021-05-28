import { AbstractSidebarTab, ISidebarTab, ISidebarTabDefaults, ILayerToolSidebarTabProps } from "../../../../sidebar";
import SettingsToolSidebarTabDefaults from "./SettingsToolSidebarTabDefaults";
import ISettingsTool from "../../types/tool/ISettingsTool";

/**
 * This class provides the settings sidebar tab.
 * 
 * @author Jiri Hynek
 */
class SettingsToolSidebarTab extends AbstractSidebarTab<ISettingsTool> implements ISidebarTab {
    
    private htmlContent: HTMLElement | undefined;

    /**
     * It creates a sidebar tab with respect to the given props.
     * 
     * @param props 
     */
    public constructor(props: ILayerToolSidebarTabProps | undefined) {
        super(props);
    }

    /**
     * It creates new defaults of the sidebar tab.
     */
    protected createDefaults(): ISidebarTabDefaults {
        return new SettingsToolSidebarTabDefaults();
    }

    /**
     * It returns generic layer tab pane.
     */
    protected getContent(): HTMLElement {
        if(this.htmlContent == undefined) {
            // tab pane contains empty div element
            this.htmlContent = document.createElement('div');

            // it provides empty tab - tab fragments can be appended
        }

        return this.htmlContent; 
    }

}
export default SettingsToolSidebarTab;