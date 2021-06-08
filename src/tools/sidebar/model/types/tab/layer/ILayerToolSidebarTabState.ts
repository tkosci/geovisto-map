import { ISidebarTabProps } from "../ISidebarTabProps";
import ISidebarTabDefaults from "../ISidebarTabDefaults";
import ISidebarTabConfig from "../ISidebarTabConfig";
import ISidebarTabState from "../ISidebarTabState";

/**
 * This interface declares the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 * 
 * @author Jiri Hynek
 */
type ILayerToolSidebarTabState<
    TProps extends ISidebarTabProps = ISidebarTabProps,
    TDefaults extends ISidebarTabDefaults = ISidebarTabDefaults,
    TConfig extends ISidebarTabConfig = ISidebarTabConfig
> = ISidebarTabState<TProps, TDefaults, TConfig>
export default ILayerToolSidebarTabState;