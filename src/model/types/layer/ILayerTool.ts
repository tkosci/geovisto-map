import ILayerToolDefaults from "./ILayerToolDefaults";
import ILayerToolState from "./ILayerToolState";
import ILayerToolProps from "./ILayerToolProps";
import { ILayerToolConfig } from "./ILayerToolConfig";
import { IMapToolInitProps } from "../tool/IMapToolProps";
import IMapTool from "../tool/IMapTool";

/**
 * This class wraps filter tool. It provides methods for layer management.
 * 
 * @author Jiri Hynek
 */
interface ILayerTool<
    TProps extends ILayerToolProps = ILayerToolProps,
    TDefaults extends ILayerToolDefaults = ILayerToolDefaults,
    TState extends ILayerToolState = ILayerToolState,
    TConfig extends ILayerToolConfig = ILayerToolConfig,
    TInitProps extends IMapToolInitProps<TConfig> = IMapToolInitProps<TConfig>
> extends IMapTool<TProps, TDefaults, TState, TConfig, TInitProps> {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ILayerTool;

    /**
     * It returns layer items which should be rendered.
     */
    getLayerItems(): L.Layer[];

    /**
     * It reloads data and redraw the layer.
     * 
     * @param onlyStyle 
     */
    redraw(onlyStyle: boolean): void;
}
export default ILayerTool;