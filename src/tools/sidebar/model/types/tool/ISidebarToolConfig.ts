// Geovisto core
import {
    IMapToolConfig
} from "../../../../../index.core";

import ISidebarTabConfig from "../tab/ISidebarTabConfig";

/**
 * This interface provides specification of sidebar tool config model.
 * 
 * @author Jiri Hynek
 */
type ISidebarToolConfig = IMapToolConfig & {
    tabs?: ISidebarTabConfig[];
}
export default ISidebarToolConfig;