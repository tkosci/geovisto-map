import {
    Control
} from "leaflet";

// Geovisto core
import {
    IMapToolState
} from "../../../../../index.core";

import ISidebarTab from "../tab/ISidebarTab";
import ISidebarTabConfig from "../tab/ISidebarTabConfig";
import ISidebarToolDefaults from "./ISidebarToolDefaults";
import ISidebarToolConfig from "./ISidebarToolConfig";
import ISidebarToolProps from "./ISidebarToolProps";

/**
 * This interface declares sidebar tool model.
 * 
 * @author Jiri Hynek
 */
interface ISidebarToolState<
    TProps extends ISidebarToolProps = ISidebarToolProps,
    TDefaults extends ISidebarToolDefaults = ISidebarToolDefaults,
    TConfig extends ISidebarToolConfig = ISidebarToolConfig
> extends IMapToolState<TProps, TDefaults, TConfig> {

    /**
     * It returns the tabs configs.
     */
    getTabsConfigs(): ISidebarTabConfig[] | undefined;

    /**
     * It returns the sidebar.
     */
    getSidebar(): Control.Sidebar | null;

    /**
     * It sets sidebar.
     * 
     * @param sidebar 
     */
    setSidebar(sidebar: Control.Sidebar): void;

    /**
     * It returns the tabs controls.
     */
    getTabs(): ISidebarTab[];

    /**
     * It sets the tabs property of the tool state.
     * 
     * @param tab
     */
    addTab(tab: ISidebarTab): void;

    /**
     * It removes tab from the list of tabs.
     * 
     * @param tab 
     */
    removeTab(tab: ISidebarTab): void;
}
export default ISidebarToolState;