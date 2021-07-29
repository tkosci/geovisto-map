// Geovisto core
import {
    ILayerTool,
    IMapToolInitProps
} from "../../../../../../index.core";

import { IConnectionLayerToolConfig } from "./IConnectionLayerToolConfig";
import IConnectionLayerToolDefaults from "./IConnectionLayerToolDefaults";
import IConnectionLayerToolProps from "./IConnectionLayerToolProps";
import IConnectionLayerToolState from "./IConnectionLayerToolState";

/**
 * This interface declares the connection layer tool.
 *
 * @author Jiri Hynek
 */
interface IConnectionLayerTool<
    TProps extends IConnectionLayerToolProps = IConnectionLayerToolProps,
    TDefaults extends IConnectionLayerToolDefaults = IConnectionLayerToolDefaults,
    TState extends IConnectionLayerToolState = IConnectionLayerToolState,
    TConfig extends IConnectionLayerToolConfig = IConnectionLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IConnectionLayerTool;
}
export default IConnectionLayerTool;
