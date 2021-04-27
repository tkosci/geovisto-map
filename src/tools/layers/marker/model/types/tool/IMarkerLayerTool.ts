import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import IMarkerLayerToolDefaults from "./IMarkerLayerToolDefaults";
import IMarkerLayerToolState from "./IMarkerLayerToolState";

/**
 * This intreface declares the marker layer.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerTool extends ILayerTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IMarkerLayerTool;

    /**
     * It creates new defaults of the tool.
     */
    getDefaults(): IMarkerLayerToolDefaults;

    /**
     * It returns default tool state.
     */
    getState(): IMarkerLayerToolState;
}

export default IMarkerLayerTool;