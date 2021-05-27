import AbstractLayerTool from "./AbstractLayerTool";
import MapToolDefaults from "../tool/MapToolDefaults";
import ILayerToolDefaults from "../../types/layer/ILayerToolDefaults";
import ILayerToolDimensions from "../../types/layer/ILayerToolDimensions";
import IMap from "../../types/map/IMap";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class LayerToolDefaults extends MapToolDefaults implements ILayerToolDefaults {

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return AbstractLayerTool.TYPE();
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Abstract layer";
    }

    /**
     * It returns the default layer tool dimensions.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public getDimensions(map?: IMap): ILayerToolDimensions {
        return {};
    }
}
export default LayerToolDefaults;