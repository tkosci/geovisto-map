// Geovisto core
import {
    LabeledAutocompleteFormInput,
    MapObjectForm
} from '../../../../../index.core';

import IMapTheme from '../../types/theme/IMapTheme';
import IMapThemesManager from '../../types/theme/IMapThemesManager';
import IThemesTool from '../../types/tool/IThemesTool';

/**
 * This class represents tab fragment for Themes tool.
 * 
 * @author Jiri Hynek
 */
class ThemesToolMapForm extends MapObjectForm<IThemesTool> {
    
    private htmlContent!: HTMLDivElement;

    /**
     * It creates a sidebar fragment with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IThemesTool) {
        super(tool);
    }

    /**
     * It returns a HTML content of the sidebar fragment which will be placed in a sidebar tab.
     */
    public getContent(): HTMLDivElement {
        if(this.htmlContent == undefined) {
            this.htmlContent = this.createContent();
        }
        return this.htmlContent;
    }

    /**
     * Help function which creates the HTML content.
     */
    protected createContent(): HTMLDivElement {
        // tab pane
        const htmlContent: HTMLDivElement = document.createElement('div');

        // theme input
        const tool: IThemesTool = this.getMapObject();
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
export default ThemesToolMapForm;