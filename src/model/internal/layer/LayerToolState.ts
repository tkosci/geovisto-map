import MapToolState from "../tool/MapToolState";
import ILayerToolState from "../../types/layer/ILayerToolState";
import ILayerTool from "../../types/layer/ILayerTool";
import ILayerToolProps from "../../types/layer/ILayerToolProps";
import ILayerToolDefaults from "../../types/layer/ILayerToolDefaults";
import ILayerToolConfig from "../../types/layer/ILayerToolConfig";
import ILayerToolDimensions from "../../types/layer/ILayerToolDimensions";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class LayerToolState extends MapToolState implements ILayerToolState {
    
    private layerName: string;
    private layerItems: L.Layer[] | undefined;
    private dimensions: ILayerToolDimensions;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ILayerTool) {
        super(tool);

        const props = <ILayerToolProps> this.getProps();
        const defaults = <ILayerToolDefaults> this.getDefaults();

        this.layerName = props.name == undefined ? defaults.getLayerName() : props.name;
        this.dimensions = {};
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props = <ILayerToolProps> this.getProps();
        const defaults = <ILayerToolDefaults> this.getDefaults();

        // the layer tool properties
        this.setLayerName(props.name == undefined ? defaults.getLayerName() : props.name);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ILayerToolConfig): void {
        super.deserialize(config);

        // the layer tool config
        if(config.name != undefined) this.setLayerName(config.name);
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    public serialize(filterDefaults: boolean): ILayerToolConfig {
        const config: ILayerToolConfig = <ILayerToolConfig> super.serialize(filterDefaults);

        const defaults = <ILayerToolDefaults> this.getDefaults();

        // serialize the layer tool properties
        config.name = filterDefaults && this.getLayerName() == defaults.getLayerName() ? undefined : this.getLayerName();

        return config;
    }

    /**
     * It returns the layer name property of the tool state.
     */
    public getLayerName(): string {
        return this.layerName;
    }

    /**
     * It sets the layer name property of the tool state.
     * 
     * @param layerName 
     */
    public setLayerName(layerName: string): void {
       this.layerName = layerName;
    }

    /**
     * It returns the layer items property of the tool state.
     */
    public getLayerItems(): L.Layer[] | undefined {
        return this.layerItems;
    }

    /**
     * It sets the layer items property of tool state.
     * 
     * @param layerItems 
     */
    public setLayerItems(layerItems: L.Layer[]): void {
       this.layerItems = layerItems;
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): ILayerToolDimensions {
        return this.dimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimensions(dimensions: ILayerToolDimensions): void {
       this.dimensions = dimensions;
    }
}
export default LayerToolState;