// Geovisto core
import {
    IMapEvent
} from "../../../../../index.core";

// Geovisto Themes Tool API
import {
    IMapTheme,
    IThemesToolAPI,
    IThemesToolAPIGetter,
    IThemesToolEvent
} from "../../../../themes";

import ISidebarTool from "../../types/tool/ISidebarTool";

/**
 * This class provides Theme change event adapter.
 * 
 * @author Jiri Hynek
 */
class ThemeChangeAdapter {
    
    private themesToolAPI?: IThemesToolAPI;

    private tool: ISidebarTool;

    public constructor(tool: ISidebarTool) {
        this.tool = tool;
    }

    /**
     * Help function which acquires and returns the themes tool if available.
     */
    private getThemesTool(): IThemesToolAPI | undefined {
        if(this.themesToolAPI == undefined) {
            const api = this.tool.getMap()?.getState().getToolsAPI() as IThemesToolAPIGetter;
            if(api.getGeovistoThemesTool) {
                this.themesToolAPI = api.getGeovistoThemesTool();
            }
        }
        return this.themesToolAPI;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == this.getThemesTool()?.getChangeEventType()) {
            const theme: IMapTheme = (<IThemesToolEvent> event).getChangedObject();
            document.documentElement.style.setProperty('--leaflet-sidebar-primary-bg', theme.getBackgroundColors().primary);
            document.documentElement.style.setProperty('--leaflet-sidebar-primary-fg', theme.getForegroundColors().primary);            
            document.documentElement.style.setProperty('--leaflet-sidebar-secondary-bg', theme.getBackgroundColors().secondary);
            document.documentElement.style.setProperty('--leaflet-sidebar-secondary-fg', theme.getForegroundColors().secondary);
            document.documentElement.style.setProperty('--leaflet-sidebar-disabled-bg', theme.getBackgroundColors().disabled);
            document.documentElement.style.setProperty('--leaflet-sidebar-disabled-fg', theme.getForegroundColors().disabled);

            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-bg', theme.getTextInputColor().matchBg);            
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-fg', theme.getTextInputColor().matchFg);
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-notmatch-bg', theme.getTextInputColor().notMatchBg);
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-notmatch-fg', theme.getTextInputColor().notMatchFg);
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-placeholder', theme.getTextInputColor().placeholder);            
            document.documentElement.style.setProperty('--geovisto-input-autocomplete-value-hover', theme.getTextInputColor().hover);            
        }
    }
}
export default ThemeChangeAdapter;