// Geovisto core
import {
    MapObjectDefaults
} from "../../../../../index.core";

import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import ISidebarTabDefaults from "../../types/tab/ISidebarTabDefaults";
/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class SidebarTabDefaults extends MapObjectDefaults implements ISidebarTabDefaults {

    /**
     * It returns the default config.
     */
    public getConfig(): ISidebarTabConfig {
        const config = <ISidebarTabConfig> super.getConfig();
        config.tool = undefined,
        config.enabled = undefined;
        return config;
    }

    /**
     * It returns a unique type string of the sidebar tab.
     */
    public getType(): string {
        return "geovisto-sidebar-tab";
    }

    /**
     * It returns the default value whether the sidebar tab is enabled.
     */
    public isEnabled(): boolean {
        return true;
    }

    /**
     * It returns name of the sidebar tab.
     */
    public getName(): string {
        return "Custom tool";
    }

    /**
     * It returns the icon of the sidebar tab.
     */
    public getIcon(): string {
        return '<i class="fa fa-file"></i>';
    }

    /**
     * It returns a logical value whether the sidebar tab contains a check button used to enable/disable the tool.
     */
    public hasCheckButton(): boolean {
        return true;
    }
}
export default SidebarTabDefaults;