// Geovisto core
import {
    IMapObjectDefaults
} from "../../../../../index.core";

import ISidebarFragmentConfig from "./ISidebarFragmentConfig";

/**
 * This interface provides functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface ISidebarFragmentDefaults extends IMapObjectDefaults {

    /**
     * It returns the default config.
     */
    getConfig(): ISidebarFragmentConfig;

    /**
     * It returns a logical value whether the sidebar fragment is enabled.
     */
    isEnabled(): boolean;
}
export default ISidebarFragmentDefaults;