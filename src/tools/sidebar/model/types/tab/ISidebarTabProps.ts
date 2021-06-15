import { IMapObjectProps, IMapObjectInitProps } from "../../../../../model/types/object/IMapObjectProps";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarTabConfig from "./ISidebarTabConfig";
import IMapFormControl from "../../../../../model/types/form/IMapFormControl";
import ISidebarTool from "../tool/ISidebarTool";
import ISidebarFragment from "../fragment/ISidebarFragment";

/**
 * This type provides specification of the sidebar tab props model.
 * 
 * @author Jiri Hynek
 */
type ISidebarTabProps = IMapObjectProps & {
    enabled?: boolean;
    name?: string;
    icon?: string;
    checkButton?: boolean;
    fragments?: [ string, ISidebarFragment ][]
}

/**
 * This type provides the specification of sidebar tab tool props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type ISidebarTabInitProps<
    TConfig extends ISidebarTabConfig = ISidebarTabConfig,
    TTool extends (IMapTool & IMapFormControl) = IMapTool & IMapFormControl
> = IMapObjectInitProps<TConfig> & {
    tool: TTool,
    sidebarTool: ISidebarTool
}
export type { ISidebarTabProps, ISidebarTabInitProps };