import ILayerTool from "../../../../../../model/types/layer/ILayerTool";
import IConnectionLayerToolDefaults from "./IConnectionLayerToolDefaults";
import IConnectionLayerToolState from "./IConnectionLayerToolState";

/**
 * This interface declares the connection layer tool.
 *
 * @author Jiri Hynek
 */
interface IConnectionLayerTool extends ILayerTool {

    /**
     * It creates a copy of the uninitialized tool.
     */
    copy(): IConnectionLayerTool;

    /**
     * It creates new defaults of the tool.
     */
    getDefaults(): IConnectionLayerToolDefaults;

    /**
     * It returns default tool state.
     */
    getState(): IConnectionLayerToolState;
}
export default IConnectionLayerTool;
