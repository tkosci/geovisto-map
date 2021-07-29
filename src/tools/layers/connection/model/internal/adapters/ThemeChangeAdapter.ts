// Geovisto core
import {
    IMapEvent
} from "../../../../../../index.core";

// Geovisto Themes Tool API
import {
    IMapTheme,
    IThemesToolAPI,
    IThemesToolAPIGetter,
    IThemesToolEvent
} from "../../../../../themes";

import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";

/**
 * This class provides Theme tool change event adapter.
 * 
 * @author Jiri Hynek
 */
class ThemeChangeAdapter {
    
    private themesToolAPI?: IThemesToolAPI;

    private tool: IConnectionLayerTool;

    public constructor(tool: IConnectionLayerTool) {
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
            document.documentElement.style.setProperty('--layer-connection', theme.getDataColors().lineColor);
            document.documentElement.style.setProperty('--layer-connection-highlight',theme.getHighlightColor().highlight);
            document.documentElement.style.setProperty('--layer-connection-other', theme.getHighlightColor().deempasize);
        }
    }
}
export default ThemeChangeAdapter;