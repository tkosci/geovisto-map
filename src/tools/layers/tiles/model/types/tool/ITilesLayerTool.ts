// Geovisto core
import {
    ILayerTool,
    IMapToolInitProps
} from "../../../../../../index.core";

import ITilesLayerToolConfig from "./ITilesLayerToolConfig";
import ITilesLayerToolDefaults from "./ITilesLayerToolDefaults";
import ITilesLayerToolProps from "./ITilesLayerToolProps";
import ITilesLayerToolState from "./ITilesLayerToolState";

/**
 * This interface declares Tiles layer tool.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerTool<
    TProps extends ITilesLayerToolProps = ITilesLayerToolProps,
    TDefaults extends ITilesLayerToolDefaults = ITilesLayerToolDefaults,
    TState extends ITilesLayerToolState = ITilesLayerToolState,
    TConfig extends ITilesLayerToolConfig = ITilesLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ILayerTool;
}

export default ITilesLayerTool;