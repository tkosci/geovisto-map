// Geovisto core
import {
    IMapToolDefaults
} from "../../../../../index.core";

import IMapTheme from "../theme/IMapTheme";
import IMapThemesManager from "../theme/IMapThemesManager";
import IThemesToolConfig from "./IThemesToolConfig";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IThemesToolDefaults extends IMapToolDefaults {

    /**
     * It returns default config if no config is given.
     */
    getConfig(): IThemesToolConfig;

    /**
     * It returns default themes manager.
     */
    getThemesManager(): IMapThemesManager;

    /**
     * It returns default theme.
     */
    getTheme(themesManager: IMapThemesManager | undefined): IMapTheme
}
export default IThemesToolDefaults;