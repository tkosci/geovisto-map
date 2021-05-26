import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import IThemesToolConfig from "./IThemesToolConfig";
import IMapThemesManager from "../theme/IMapThemesManager";
import IMapTheme from "../theme/IMapTheme";
import IThemesToolDefaults from "./IThemesToolDefaults";
import IThemesToolProps from "./IThemesToolProps";

/**
 * This interface declares functions for using themes.
 * 
 * @author Jiri Hynek
 */
interface IThemesToolState<
    TProps extends IThemesToolProps = IThemesToolProps,
    TDefaults extends IThemesToolDefaults = IThemesToolDefaults,
    TConfig extends IThemesToolConfig = IThemesToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns themes manager.
     */
    getThemesManager(): IMapThemesManager

    /**
     * It sets themes manager.
     * 
     * @param manager 
     */
    setThemesManager(manager: IMapThemesManager): void;

    /**
     * It returns the theme property of the tool state.
     */
    getTheme(): IMapTheme;

    /**
     * It sets the theme property of the tool state.
     * 
     * @param theme 
     */
    setTheme(theme: IMapTheme): void;
}
export default IThemesToolState;