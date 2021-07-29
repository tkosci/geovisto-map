// Geovisto core
import {
    IMapFormControl,
    IMapObjectInitProps,
    IMapObjectProps,
    IMapTool
} from "../../../../../index.core";

import ISidebarFragmentConfig from "./ISidebarFragmentConfig";
import ISidebarTab from "../tab/ISidebarTab";

/**
 * This type provides specification of the sidebar fragment props model.
 * 
 * @author Jiri Hynek
 */
type ISidebarFragmentProps = IMapObjectProps & {
    enabled?: boolean;
}

/**
 * This type provides the specification of the sidebar fragment props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type ISidebarFragmnetInitProps<
    TConfig extends ISidebarFragmentConfig = ISidebarFragmentConfig,
    TTool extends (IMapTool & IMapFormControl) = IMapTool & IMapFormControl
> = IMapObjectInitProps<TConfig> & {
    sidebarTab: ISidebarTab,
    tool: TTool
}
export type { ISidebarFragmentProps, ISidebarFragmnetInitProps as ISidebarFragmentInitProps };