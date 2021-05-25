import { ILayerToolSidebarTabDefaults, LayerToolSidebarTabDefaults } from "../../../../../sidebar";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolSidebarTabDefaults extends LayerToolSidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It returns the default name of the tab.
     */
    public getName(): string {
        return "Connection layer tool settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-road"></i>';
    }
}
export default ConnectionLayerToolSidebarTabDefaults;