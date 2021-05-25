import { ISidebarTab, ISidebarTabDefaults, SidebarTabDefaults } from "../../../../sidebar";
import IMapObject from "../../../../../model/types/object/IMapObject";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class FiltersToolSidebarTabDefaults extends SidebarTabDefaults implements ISidebarTabDefaults {

    /**
     * It returns name of tab pane.
     */
    public getName(): string {
        return "Filters";
    }

    /**
     * It returns the icon of the tab pane.
     */
    public getIcon(): string {
        return '<i class="fa fa-filter"></i>';
    }

    /**
     * It returns the element class.
     */
    public getFilterRuleElementClass(objectType: string | undefined): string {
        if(objectType) {
            return objectType + "-filter";
        }
        return "unknown-object-filter";
    }
}
export default FiltersToolSidebarTabDefaults;
