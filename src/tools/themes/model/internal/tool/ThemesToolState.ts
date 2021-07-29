// Geovisto core
import { 
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import IMapTheme from "../../types/theme/IMapTheme";
import IMapThemesManager from "../../types/theme/IMapThemesManager";
import IThemesTool from "../../types/tool/IThemesTool";
import IThemesToolConfig from "../../types/tool/IThemesToolConfig";
import IThemesToolDefaults from "../../types/tool/IThemesToolDefaults";
import IThemesToolProps from "../../types/tool/IThemesToolProps";
import IThemesToolState from "../../types/tool/IThemesToolState";

/**
 * This class provide functions for using themes.
 * 
 * @author Jiri Hynek
 */
class ThemesToolState extends MapToolState implements IThemesToolState {
    
    private manager!: IMapThemesManager;
    private theme!: IMapTheme;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IThemesTool) {
        super(tool);
    }

    /**
     * It resets the state with respect to the initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: IThemesToolDefaults, props: IThemesToolProps, initProps: IMapToolInitProps<IThemesToolConfig>): void {
        // set theme manager - needs to be set before the theme
        this.setThemesManager(props.manager == undefined ? defaults.getThemesManager() : props.manager);

        // set theme
        this.setTheme(props.theme == undefined ? defaults.getTheme(this.getThemesManager()) : props.theme);

        // initialize super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IThemesToolConfig): void {
        super.deserialize(config);

        // deserialize theme id
        if(config.theme != undefined) {
            // get filter and data manegers which are need for proper deserialization of filter rules
            const themesManager = this.getThemesManager();
            if(themesManager != undefined) {
                const theme: IMapTheme | undefined = themesManager.getDomain(config.theme);
                if(theme) {
                    this.setTheme(theme);
                }
            }
        }
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IThemesToolDefaults | undefined): IThemesToolConfig {
        const config: IThemesToolConfig = <IThemesToolConfig> super.serialize(defaults);

        // serialize the theme
        const theme = this.getTheme();
        const defaultTheme: IMapTheme | undefined = defaults?.getTheme(this.getThemesManager());
        config.theme = defaultTheme && theme.getName() == defaultTheme.getName() ? undefined : theme.getName();

        return config;
    }

    /**
     * It returns themes manager.
     */
    public getThemesManager(): IMapThemesManager {
        return this.manager;
    }

    /**
     * It sets themes manager.
     * 
     * @param manager 
     */
    public setThemesManager(manager: IMapThemesManager): void {
        this.manager = manager;
    }

    /**
     * It returns the theme property of the tool state.
     */
    public getTheme(): IMapTheme {
        return this.theme;
    }

    /**
     * It sets the theme property of the tool state.
     * 
     * @param theme 
     */
    public setTheme(theme: IMapTheme): void {
       this.theme = theme;
    }
}
export default ThemesToolState;