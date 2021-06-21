import { ILayerToolConfig } from "./ILayerToolConfig";
import ILayerToolDefaults from "./ILayerToolDefaults";
import { IMapToolInitProps } from "../tool/IMapToolProps";
import ILayerToolProps from "./ILayerToolProps";
import ILayerToolState from "./ILayerToolState";
import IMapDimension from "../dimension/IMapDimension";
import IMapDomain from "../domain/IMapDomain";
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
     * It updates the dimension.
     * 
     * @param dimension 
     * @param value 
     * @param redraw 
     */
    updateDimension(dimension: IMapDimension<IMapDomain>, value: string, redraw: number | undefined): void;

    /**
     * It reloads data and redraw the layer with respect to the type.
     * 
     * By default it works with LayerRedrawType
     * 
     * @param type 
     */
    redraw(type: number): void;
}
export default ILayerTool;