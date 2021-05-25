import { ILayerToolSidebarTabDefaults, LayerToolSidebarTabDefaults } from "../../../../../sidebar";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolSidebarTabDefaults extends LayerToolSidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It returns the default name of the tab.
     */
    public getName(): string {
        return "Choropleth layer tool settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-th-large"></i>';
    }
}
export default ChoroplethLayerToolSidebarTabDefaults;