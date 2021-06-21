// Geovisto core
import IMapTool from "../../../../../model/types/tool/IMapTool";
import { IMapToolInitProps } from "../../../../../model/types/tool/IMapToolProps";

import IMapTheme from "../theme/IMapTheme";
import IThemesToolConfig from "./IThemesToolConfig";
import IThemesToolDefaults from "./IThemesToolDefaults";
import IThemesToolProps from "./IThemesToolProps";
import IThemesToolState from "./IThemesToolState";

/**
 * This interface provides the themes tool.
 * 
 * @author Jiri Hynek
 */
interface IThemesTool<
    TProps extends IThemesToolProps = IThemesToolProps,
    TDefaults extends IThemesToolDefaults = IThemesToolDefaults,
    TState extends IThemesToolState = IThemesToolState,
    TConfig extends IThemesToolConfig = IThemesToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IThemesTool;

    /**
     * It updates the theme and notifies listeners.
     * 
     * @param theme 
     */
    setTheme(theme: IMapTheme): void
}
export default IThemesTool;