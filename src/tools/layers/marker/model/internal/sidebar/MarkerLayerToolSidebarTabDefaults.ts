import { LayerToolSidebarTabDefaults, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolSidebarTabDefaults extends LayerToolSidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It returns the default name of the tab.
     */
    public getName(): string {
        return "Marker layer tool settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-map-marker"></i>';
    }
}
export default MarkerLayerToolSidebarTabDefaults;