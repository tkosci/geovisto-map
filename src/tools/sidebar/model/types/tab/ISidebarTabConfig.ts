// Geovisto core
import IMapObjectConfig from "../../../../../model/types/object/IMapObjectConfig";

import ISidebarFragmentConfig from "../fragment/ISidebarFragmentConfig";

/**
 * This type provides specification of sidebar fragment config model.
 * 
 * @author Jiri Hynek
 */
type ISidebarTabConfig = IMapObjectConfig & {
    tool?: string;
    enabled?: boolean;
    name?: string;
    icon?: string;
    checkButton?: boolean;
    fragments?: ISidebarFragmentConfig[];
}
export default ISidebarTabConfig;