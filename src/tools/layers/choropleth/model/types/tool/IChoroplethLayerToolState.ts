// Geovisto core
import {
    ILayerToolState,
    IMapAggregationBucket
} from "../../../../../../index.core";

import { IChoroplethLayerToolConfig, IChoroplethLayerToolDimensionsConfig } from "./IChoroplethLayerToolConfig";
import IChoroplethLayerToolDefaults from "./IChoroplethLayerToolDefaults";
import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";
import IChoroplethLayerToolProps from "./IChoroplethLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolState<
    TProps extends IChoroplethLayerToolProps = IChoroplethLayerToolProps,
    TDefaults extends IChoroplethLayerToolDefaults = IChoroplethLayerToolDefaults,
    TConfig extends IChoroplethLayerToolConfig = IChoroplethLayerToolConfig,
    TDimensionsConfig extends IChoroplethLayerToolDimensionsConfig = IChoroplethLayerToolDimensionsConfig,
    TDimensions extends IChoroplethLayerToolDimensions = IChoroplethLayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {

    /**
     * It returns a Leaflet geoJSON layer.
     */
    getGeoJSONLayer(): L.GeoJSON | undefined;

    /**
     * It sets a Leaflet geoJSON layer.
     * 
     * @param layer 
     */
    setGeoJSONLayer(layer: L.GeoJSON): void;

    /**
     * It returns the hovered item.
     */
    getHoveredItem(): string | undefined;

    /**
     * It sets the hovered item.
     * 
     * @param hoveredItem 
     */
    setHoveredItem(hoveredItem: string | undefined): void;

    /**
     * It returns the z index.
     */
    getZIndex(): number;

    /**
     * It sets the z index.
     * 
     * @param zindex 
     */
    setZIndex(zindex: number): void;

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    getBucketData(): Map<string, IMapAggregationBucket>;

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    setBucketData(bucketData: Map<string, IMapAggregationBucket>): void;
}
export default IChoroplethLayerToolState;