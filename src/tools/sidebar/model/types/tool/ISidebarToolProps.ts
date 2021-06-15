import { IMapToolProps } from "../../../../../model/types/tool/IMapToolProps";
import ISidebarTab from "../tab/ISidebarTab";

/**
 * This type provides the specification of sidebar tool props model.
 * 
 * @author Jiri Hynek
 */
type ISidebarToolProps = IMapToolProps & {
    tabs?: [ string, ISidebarTab ][];
}
export default ISidebarToolProps;