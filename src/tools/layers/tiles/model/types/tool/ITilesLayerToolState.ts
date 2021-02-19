// Geovisto core
import ILayerToolDimensions from "../../../../../../model/types/layer/ILayerToolDimensions";
import { ILayerToolDimensionsConfig } from "../../../../../../model/types/layer/ILayerToolConfig";
import ILayerToolState from "../../../../../../model/types/layer/ILayerToolState";

import ITilesLayerToolConfig from "./ITilesLayerToolConfig";
import ITilesLayerToolDefaults from "./ITilesLayerToolDefaults";
import ITilesLayerToolProps from "./ITilesLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface ITilesLayerToolState<
    TProps extends ITilesLayerToolProps = ITilesLayerToolProps,
    TDefaults extends ITilesLayerToolDefaults = ITilesLayerToolDefaults,
    TConfig extends ITilesLayerToolConfig = ITilesLayerToolConfig,
    TDimensionsConfig extends ILayerToolDimensionsConfig = ILayerToolDimensionsConfig,
    TDimensions extends ILayerToolDimensions = ILayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {

    /**
     * It returns a base map ID.
     */
    getBaseMap(): string;

    /**
     * It sets a base map ID.
     * 
     * @param baseMap
     */
    setBaseMap(baseMap: string): void;

    /**
     * It returns a Leaflet tile layer.
     */
    getTileLayer(): L.TileLayer | undefined;

    /**
     * It sets a Leaflet tile layer.
     * 
     * @param layer 
     */
    setTileLayer(layer: L.TileLayer): void;
}
export default ITilesLayerToolState;