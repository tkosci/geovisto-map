import MapTool from "../../internal/tool/MapTool";
import ILayerToolDefaults from "./ILayerToolDefaults";
import ILayerToolState from "./ILayerToolState";

/**
 * This class wraps filter tool. It provides methods for layer management.
 * 
 * @author Jiri Hynek
 */
interface ILayerTool extends MapTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): ILayerTool;

    /**
     * It creates new defaults of the tool.
     */
    getDefaults(): ILayerToolDefaults;

    /**
     * It returns default tool state.
     */
    getState(): ILayerToolState;

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