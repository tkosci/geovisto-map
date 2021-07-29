// Geovisto core
import {
    MapToolDefaults
} from "../../../../../index.core";

import ISidebarToolConfig from "../../types/tool/ISidebarToolConfig";
import ISidebarToolDefaults from "../../types/tool/ISidebarToolDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SidebarToolDefaults extends MapToolDefaults implements ISidebarToolDefaults {

    /**
     * It returns the default config.
     */
    public getConfig(): ISidebarToolConfig {
        const config = <ISidebarToolConfig> super.getConfig();
        config.tabs = undefined;
        return config;
    }

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-sidebar";

    /**
     * It returns a unique string of the tool type.
     */
    public getType(): string {
        return SidebarToolDefaults.TYPE;
    }

    /**
     * Only one sidebar tool should be present in the Geovisto map.
     */
    public isSingleton(): boolean {
       return true; 
    }
}
export default SidebarToolDefaults;