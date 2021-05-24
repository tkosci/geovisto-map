import IMapObjectConfig from "../../../../../model/types/object/IMapObjectConfig";
import ISidebarFragmentConfig from "../fragment/ISidebarFragmentConfig";

/**
 * This type provides specification of sidebar fragment config model.
 * 
 * @author Jiri Hynek
 */
type ISidebarTabConfig = IMapObjectConfig & {
    tool: string | undefined;
    enabled: boolean | undefined;
    name: string | undefined;
    icon: string | undefined;
    checkButton: boolean | undefined;
    fragments: ISidebarFragmentConfig[] | undefined;
}
export default ISidebarTabConfig;