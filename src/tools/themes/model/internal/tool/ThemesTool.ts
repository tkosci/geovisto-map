// Geovisto core
import {
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    MapTool
} from "../../../../../index.core";

import IMapTheme from "../../types/theme/IMapTheme";
import IThemesTool from "../../types/tool/IThemesTool";
import { IThemesToolAPI, IThemesToolAPIGetter } from "../../types/tool/IThemesToolAPI";
import IThemesToolDefaults from "../../types/tool/IThemesToolDefaults";
import IThemesToolProps from "../../types/tool/IThemesToolProps";
import IThemesToolState from "../../types/tool/IThemesToolState";
import ThemesToolMapForm from "../form/ThemesToolMapForm";
import IThemesToolConfig from "../../types/tool/IThemesToolConfig";
import ThemesToolAPI from "./ThemesToolAPI";
import ThemesToolDefaults from "./ThemesToolDefaults";
import ThemesToolEvent from "../event/ThemesToolEvent";
import ThemesToolState from "./ThemesToolState";

/**
 * Attribute which is set to the map container.
 */
const THEME_ATTR_NAME = "data-theme";

/**
 * This class provides the themes tool.
 * 
 * @author Jiri Hynek
 */
class ThemesTool extends MapTool implements IThemesTool, IMapFormControl {

    /**
     * tool api
     */
    private static api: IThemesToolAPI = ThemesToolAPI;
    
    /**
     * TODO: move to the tool state.
     */
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props?: IThemesToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IThemesTool {
        return new ThemesTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IThemesToolProps {
        return <IThemesToolProps> super.getProps();
    }
    
    /**
     * It returns default values of the themes tool.
     */
    public getDefaults(): IThemesToolDefaults {
        return <IThemesToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IThemesToolDefaults {
        return new ThemesToolDefaults();
    }

    /**
     * It returns the themes tool state.
     */
    public getState(): IThemesToolState {
        return <IThemesToolState> super.getState();
    }

    /**
     * It returns the tool state.
     */
    protected createState(): IThemesToolState {
        return new ThemesToolState(this);
    }

    /**
     * It returns the tool API
     */
    public getAPIGetter(): IThemesToolAPIGetter | undefined {
        return {
            getGeovistoThemesTool: () => ThemesTool.api
        };
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IThemesToolConfig>): this {
        this.initializeAPI();
        return super.initialize(initProps);
    }

    /**
     * Help method which initializes the API.
     */
    protected initializeAPI(): void {
        // use this tool reference in API (this tool should be used as a singleton)
        ThemesTool.api.getTheme = () => this.getState().getTheme();
        ThemesTool.api.setTheme = (theme: IMapTheme) => this.setTheme(theme);
    }

    /**
     * It creates new filter tool.
     */
    public create(): this {
        // set theme
        const theme = this.getState().getTheme();
        if(theme) {
            this.setTheme(theme);
        }

        return this;
    }

    /**
     * It updates the theme and notifies listeners.
     * 
     * @param theme 
     */
    public setTheme(theme: IMapTheme): void {
        if(theme != undefined) {
            // if the theme tool is enabled, update map theme
            const map = this.getMap();
            if(this.isEnabled() && map) {
                // update map container theme attribute (used by CSS selectors)
                const mapContainer = document.getElementById(map.getId());
                if(mapContainer) {
                    mapContainer.setAttribute(THEME_ATTR_NAME, theme.getName());
                }

                // update tool state
                this.getState().setTheme(theme);

                // update global styles
                this.updateGlobalStyles(theme);

                // dispatch event
                map.getState().getEventManager().scheduleEvent(new ThemesToolEvent(this, theme), undefined, undefined);
            }
        }
    }

    /**
     * This function updates the global styles.
     * 
     * @param theme 
     */
    protected updateGlobalStyles(theme: IMapTheme): void {
        document.documentElement.style.setProperty('--default-font', theme.getFont());
    }

    /**
     * It returns tab control with respect to the configuration
     */
    public getMapForm(): IMapForm {
        if(this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It creates new tab fragment.
     */
    protected createMapForm(): IMapForm {
        // override if needed
        return new ThemesToolMapForm(this);
    }
}
export default ThemesTool;