// Geovisto core
import {
    IMapObjectConfig
} from "../../../../../index.core";

/**
 * This type provides specification of sidebar fragment config model.
 * 
 * @author Jiri Hynek
 */
type ISidebarFragmentConfig = IMapObjectConfig & {
    tool?: string;
    enabled?: boolean;
}
export default ISidebarFragmentConfig;