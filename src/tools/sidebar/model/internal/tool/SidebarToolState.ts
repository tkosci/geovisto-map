// Leaflet
import {
    Control
} from "leaflet";

// Geovisto core
import {
    IMapToolInitProps,
    MapToolState
} from "../../../../../index.core";

import ISidebarTab from "../../types/tab/ISidebarTab";
import ISidebarTabConfig from "../../types/tab/ISidebarTabConfig";
import ISidebarTool from "../../types/tool/ISidebarTool";
import ISidebarToolConfig from "../../types/tool/ISidebarToolConfig";
import ISidebarToolDefaults from "../../types/tool/ISidebarToolDefaults";
import ISidebarToolProps from "../../types/tool/ISidebarToolProps";
import ISidebarToolState from "../../types/tool/ISidebarToolState";
import SidebarToolDefaults from "./SidebarToolDefaults";

/**
 * This class provide sidebar tool model.
 * 
 * @author Jiri Hynek
 */
class SidebarToolState extends MapToolState implements ISidebarToolState {
    
    private tabsConfigs?: ISidebarTabConfig[];
    
    private tabs: ISidebarTab[];
    
    private sidebar: Control.Sidebar | null;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ISidebarTool) {
        super(tool);

        // tabs will be added by using addTab function
        this.tabsConfigs = undefined;
        this.tabs = [];
        this.sidebar = null;
    }

    /**
     * It resets state with respect to initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: ISidebarToolDefaults, props: ISidebarToolProps, initProps: IMapToolInitProps<ISidebarToolConfig>): void {
        this.tabs = [];

        // initialize super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ISidebarToolConfig): void {
        super.deserialize(config);

        // original tabs desriptions can be used after all tools are initialized during the sidebar tool creation
        this.tabsConfigs = config.tabs;
    }

    /**
     * The method serializes the tool configuration. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: SidebarToolDefaults | undefined): ISidebarToolConfig {
        const config: ISidebarToolConfig = <ISidebarToolConfig> super.serialize(defaults);

        // serialize sidebar tabs
        config.tabs = [];
        const tabs: ISidebarTab[] = this.getTabs();
        for(let i = 0; i < tabs.length; i++) {
            config.tabs.push(tabs[i].getState().serialize(tabs[i].getDefaults()));
        }

        return config;
    }

    /**
     * It returns the tabs configs.
     */
    public getTabsConfigs(): ISidebarTabConfig[] | undefined {
        return this.tabsConfigs;
    }

    /**
     * It returns the sidebar.
     */
    public getSidebar(): Control.Sidebar | null {
        return this.sidebar;
    }

    /**
     * It sets sidebar.
     * 
     * @param sidebar 
     */
    public setSidebar(sidebar: Control.Sidebar): void {
        this.sidebar = sidebar;
    }

    /**
     * It returns the tabs controls.
     */
    public getTabs(): ISidebarTab[] {
        return this.tabs;
    }

    /**
     * It sets the tabs property of the tool state.
     * 
     * @param tab
     */
    public addTab(tab: ISidebarTab): void {
        this.tabs.push(tab);
    }

    /**
     * It removes tab from the list of tabs.
     * 
     * @param tab 
     */
    public removeTab(tab: ISidebarTab): void {
        const index = this.tabs.indexOf(tab);
        if (index > -1) {
            this.tabs.splice(index, 1);
        }
    }
}
export default SidebarToolState;