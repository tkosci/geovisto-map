import MapToolDefaults from "../../../../../model/internal/tool/MapToolDefaults";
import ISettingsToolDefaults from "../../types/tool/ISettingsToolDefaults";
import ISettingsToolConfig from "../../types/tool/ISettingsToolConfig";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SettingsToolDefaults extends MapToolDefaults implements ISettingsToolDefaults {
    
    /**
     * It returns default config if no config is given.
     */
    public getConfig(): ISettingsToolConfig {
        return <ISettingsToolConfig> super.getConfig();
    }

    /**
     * Only one settings tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-settings";

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return SettingsToolDefaults.TYPE;
    }
    
    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return "General settings";
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-gear"></i>';
    }
}
export default SettingsToolDefaults;