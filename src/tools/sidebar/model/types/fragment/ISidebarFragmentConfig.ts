import IMapObjectConfig from "../../../../../model/types/object/IMapObjectConfig";

/**
 * This type provides specification of sidebar fragment config model.
 * 
 * @author Jiri Hynek
 */
type ISidebarFragmentConfig = IMapObjectConfig & {
    tool: string | undefined;
    enabled: boolean | undefined;
}
export default ISidebarFragmentConfig;