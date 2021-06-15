import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import ITilesLayerToolState from "../../types/tool/ITilesLayerToolState";
import ITilesLayerTool from "../../types/tool/ITilesLayerTool";
import ITilesLayerToolProps from "../../types/tool/ITilesLayerToolProps";
import ITilesLayerToolDefaults from "../../types/tool/ITilesLayerToolDefaults";
import ITilesLayerToolConfig from "../../types/tool/ITilesLayerToolConfig";
import { IMapToolInitProps } from "../../../../../../model/types/tool/IMapToolProps";
import { IMarkerLayerToolConfig } from "../../../../marker";

/**
 * This class provide functions for using the state of the tiles layer tool.
 * 
 * @author Jiri Hynek
 */
class TilesLayerToolState extends LayerToolState implements ITilesLayerToolState {
    
    private baseMap!: string;
    private layer?: L.TileLayer;

    /**
     * It creates a tool state.
     */
    public constructor(tool: ITilesLayerTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     */
    public initialize(defaults: ITilesLayerToolDefaults, props: ITilesLayerToolProps, initProps: IMapToolInitProps<IMarkerLayerToolConfig>): void {
        // the map layer tool properties
        this.setBaseMap(props.baseMap == undefined ? defaults.getBaseMap() : props.baseMap);

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: ITilesLayerToolConfig): void {
        super.deserialize(config);

        // the map layer tool config
        // TODO
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: ITilesLayerToolDefaults | undefined): ITilesLayerToolConfig {
        const config: ITilesLayerToolConfig = <ITilesLayerToolConfig> super.serialize(defaults);

        // serialize the map layer tool properties
        // TODO

        return config;
    }

    /**
     * It returns a base map ID.
     */
    public getBaseMap(): string {
        return this.baseMap;
    }

    /**
     * It sets a base map ID.
     * 
     * @param baseMap
     */
    public setBaseMap(baseMap: string): void {
        this.baseMap = baseMap;
    }

    /**
     * It returns a Leaflet tile layer.
     */
    public getTileLayer(): L.TileLayer | undefined {
        return this.layer;
    }

    /**
     * It sets a Leaflet tile layer.
     * 
     * @param layer 
     */
    public setTileLayer(layer: L.TileLayer): void {
        this.layer = layer;
    }
}
export default TilesLayerToolState;