// Geovisto core
import {
    IMapToolProps
} from "../../../../../index.core";

import ISidebarTab from "../tab/ISidebarTab";

/**
 * This type provides the specification of sidebar tool props model.
 * 
 * @author Jiri Hynek
 */
type ISidebarToolProps = IMapToolProps & {
    tabs?: [ string | undefined, ISidebarTab ][];
}
export default ISidebarToolProps;