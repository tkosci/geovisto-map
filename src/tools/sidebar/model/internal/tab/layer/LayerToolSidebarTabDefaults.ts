import { SidebarTabDefaults } from "../../../..";
import ILayerToolSidebarTabDefaults from "../../../types/tab/layer/ILayerToolSidebarTabDefaults";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class LayerToolSidebarTabDefaults extends SidebarTabDefaults implements ILayerToolSidebarTabDefaults {

    /**
     * It returns name of tab pane.
     */
    public getName(): string {
        return "Custom layer tool settings";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-file"></i>';
    }
}
export default LayerToolSidebarTabDefaults;