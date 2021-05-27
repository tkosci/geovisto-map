import { ISidebarTab } from "../../../..";
import ILayerToolSidebarTabDefaults from "./ILayerToolSidebarTabDefaults";
import ILayerToolSidebarTabState from "./ILayerToolSidebarTabState";
import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import ILayerToolSidebarTabProps from "./ILayerToolSidebarTabProps";
import ILayerToolSidebarTabConfig from "./ILayerToolSidebarTabConfig";
import { ISidebarTabInitProps } from "../ISidebarTabProps";

/**
 * This interface declares functions for management of a layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
interface ILayerToolSidebarTab<
    TProps extends ILayerToolSidebarTabProps = ILayerToolSidebarTabProps,
    TDefaults extends ILayerToolSidebarTabDefaults = ILayerToolSidebarTabDefaults,
    TState extends ILayerToolSidebarTabState = ILayerToolSidebarTabState,
    TConfig extends ILayerToolSidebarTabConfig = ILayerToolSidebarTabConfig,
    TInitProps extends ISidebarTabInitProps<TConfig, ILayerTool> = ISidebarTabInitProps<TConfig, ILayerTool>
> extends ISidebarTab<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * Help function which returns the tool from the state.
     */
    getTool(): ILayerTool;
}
export default ILayerToolSidebarTab;