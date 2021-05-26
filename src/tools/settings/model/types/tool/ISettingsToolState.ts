import IMapToolState from "../../../../../model/types/tool/IMapToolState";
import ISettingsToolConfig from "./ISettingsToolConfig";
import ISettingsToolDefaults from "./ISettingsToolDefaults";
import ISettingsToolProps from "./ISettingsToolProps";

/**
 * This class provide functions for using selections.
 * 
 * @author Jiri Hynek
 */
type ISettingsToolState<
    TProps extends ISettingsToolProps = ISettingsToolProps,
    TDefaults extends ISettingsToolDefaults = ISettingsToolDefaults,
    TConfig extends ISettingsToolConfig = ISettingsToolConfig
> = IMapToolState<TProps, TDefaults, TConfig>
export default ISettingsToolState;