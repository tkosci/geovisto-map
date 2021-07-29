// Geovisto core
import {
    ILayerTool,
    IMapToolInitProps
} from "../../../../../../index.core";

import { IChoroplethLayerToolConfig } from "./IChoroplethLayerToolConfig";
import IChoroplethLayerToolDefaults from "./IChoroplethLayerToolDefaults";
import IChoroplethLayerToolProps from "./IChoroplethLayerToolProps";
import IChoroplethLayerToolState from "./IChoroplethLayerToolState";

/**
 * This interface declares the choropleth layer tool.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerTool<
    TProps extends IChoroplethLayerToolProps = IChoroplethLayerToolProps,
    TDefaults extends IChoroplethLayerToolDefaults = IChoroplethLayerToolDefaults,
    TState extends IChoroplethLayerToolState = IChoroplethLayerToolState,
    TConfig extends IChoroplethLayerToolConfig = IChoroplethLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IChoroplethLayerTool;

}

export default IChoroplethLayerTool;