import { IMapObjectProps, IMapObjectInitProps } from "../../../../../model/types/object/IMapObjectProps";
import IMapObjectConfig from "../../../../../model/types/object/IMapObjectConfig";
import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import { Control } from "leaflet";
import ISidebarTabConfig from "./ISidebarTabConfig";

/**
 * This type provides specification of the sidebar tab props model.
 * 
 * @author Jiri Hynek
 */
type ISidebarTabProps = IMapObjectProps & {
    enabled: boolean | undefined;
    name: string | undefined;
    icon: string | undefined;
    checkButton: boolean | undefined;
}

/**
 * This type provides the specification of sidebar tab tool props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type ISidebarTabInitProps<
    TConfig extends ISidebarTabConfig = ISidebarTabConfig,
    TTool extends IMapTool = IMapTool
> = IMapObjectInitProps<TConfig> & {
    sidebar: Control.Sidebar,
    tool: TTool
}
export type { ISidebarTabProps, ISidebarTabInitProps };