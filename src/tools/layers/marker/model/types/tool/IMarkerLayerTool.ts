// Geovisto core
import {
    ILayerTool,
    IMapToolInitProps
} from "../../../../../../index.core";

import { IMarkerLayerToolConfig } from "./IMarkerLayerToolConfig";
import IMarkerLayerToolDefaults from "./IMarkerLayerToolDefaults";
import IMarkerLayerToolProps from "./IMarkerLayerToolProps";
import IMarkerLayerToolState from "./IMarkerLayerToolState";

/**
 * This intreface declares the marker layer.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerTool<
    TProps extends IMarkerLayerToolProps = IMarkerLayerToolProps,
    TDefaults extends IMarkerLayerToolDefaults = IMarkerLayerToolDefaults,
    TState extends IMarkerLayerToolState = IMarkerLayerToolState,
    TConfig extends IMarkerLayerToolConfig = IMarkerLayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends ILayerTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IMarkerLayerTool;
}
export default IMarkerLayerTool;