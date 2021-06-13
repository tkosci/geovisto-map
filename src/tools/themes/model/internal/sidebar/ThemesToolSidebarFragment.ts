import LabeledAutocompleteFormInput from '../../../../../model/internal/inputs/labeled/autocomplete/LabeledAutocompleteFormInput';
import { ISidebarTab, ISidebarFragmentProps, AbstractSidebarFragment } from '../../../../sidebar';
import { GeovistoSettingsTool } from '../../../../settings';
import IMapTheme from '../../types/theme/IMapTheme';
import IMapThemesManager from '../../types/theme/IMapThemesManager';
import IThemesTool from '../../types/tool/IThemesTool';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * @author Jiri Hynek
 */
class ThemesToolSidebarFragment extends AbstractSidebarFragment<IThemesTool> {
    
    private htmlContent: HTMLElement | undefined;

    /**
     * It creates a sidebar fragment with respect to the given props.
     * 
     * @param props 
     */
    public constructor(props: ISidebarFragmentProps | undefined) {
        super(props);
    }

    /**
     * The function returns true if the sidebar fragment should be included in the sidebar tab.
     * 
     * @param sidebarTab 
     */
    public isChild(sidebarTab: ISidebarTab): boolean {
        return sidebarTab.getTool().getType() == GeovistoSettingsTool.getType();
    }

    /**
     * It returns a HTML content of the sidebar fragment which will be placed in a sidebar tab.
     */
    public getContent(): HTMLElement {
        if(this.htmlContent == undefined) {
            this.htmlContent = this.createContent();
        }
        return this.htmlContent;
    }

    /**
     * Help function which creates the HTML content.
     */
    protected createContent(): HTMLElement {
        // tab pane
        const htmlContent: HTMLDivElement = document.createElement('div');

        // theme input
        const tool: IThemesTool = <IThemesTool> this.getState().getTool();
        const themesManager: IMapThemesManager = tool.getState().getThemesManager();
        const changeTheme = function(e: Event) {
            const newTheme: IMapTheme | undefined = themesManager.getDomain((e.target as HTMLInputElement)?.value);
            if(newTheme) {
                tool.setTheme(newTheme);
            }
        };
        const themeInput = new LabeledAutocompleteFormInput({ label: "Theme", options: themesManager.getDomainNames(), onChangeAction: changeTheme });
        htmlContent.appendChild(themeInput.create());
        themeInput.setValue(tool.getState().getTheme().getName());

        return htmlContent;
    }

}
export default ThemesToolSidebarFragment;