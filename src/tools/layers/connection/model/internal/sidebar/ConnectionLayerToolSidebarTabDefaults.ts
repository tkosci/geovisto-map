import { ILayerToolSidebarTabDefaults, ILayerToolSidebarTab, LayerToolSidebarTabDefaults } from "../../../../../sidebar";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolSidebarTabDefaults extends LayerToolSidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It creates sidebar tab defaults.
     */
    public constructor(sidebarTab: ILayerToolSidebarTab) {
        super(sidebarTab);
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-road"></i>';
    }
}
export default ConnectionLayerToolSidebarTabDefaults;