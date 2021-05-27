import { IMapObjectProps, IMapObjectInitProps } from "../../../../../model/types/object/IMapObjectProps";
import IMapTool from "../../../../../model/types/tool/IMapTool";
import ISidebarTab from "../tab/ISidebarTab";
import ISidebarFragmentConfig from "./ISidebarFragmentConfig";

/**
 * This type provides specification of the sidebar fragment props model.
 * 
 * @author Jiri Hynek
 */
type ISidebarFragmentProps = IMapObjectProps & {
    enabled: boolean | undefined;
}

/**
 * This type provides the specification of the sidebar fragment props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type ISidebarFragmnetInitProps<
    TConfig extends ISidebarFragmentConfig = ISidebarFragmentConfig,
    TTool extends IMapTool = IMapTool
> = IMapObjectInitProps<TConfig> & {
    sidebarTab: ISidebarTab,
    tool: TTool
}
export type { ISidebarFragmentProps, ISidebarFragmnetInitProps as ISidebarFragmentInitProps };