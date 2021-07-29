// Geovisto core
import {
    IMapTool,
    IMapToolInitProps
} from '../../../../../index.core';

import ISidebarTab from '../tab/ISidebarTab';
import ISidebarToolConfig from './ISidebarToolConfig';
import ISidebarToolDefaults from './ISidebarToolDefaults';
import ISidebarToolProps from './ISidebarToolProps';
import ISidebarToolState from "./ISidebarToolState";

/**
 * This class provides the sidebar tool.
 *
 * @author Jiri Hynek
 */
interface ISidebarTool<
    TProps extends ISidebarToolProps = ISidebarToolProps,
    TDefaults extends ISidebarToolDefaults = ISidebarToolDefaults,
    TState extends ISidebarToolState = ISidebarToolState,
    TConfig extends ISidebarToolConfig = ISidebarToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ISidebarTool;

    /**
     * Help function which returns sidebar tabs of the tool state.
     */
    getTabs(): ISidebarTab[]
}
export default ISidebarTool;
