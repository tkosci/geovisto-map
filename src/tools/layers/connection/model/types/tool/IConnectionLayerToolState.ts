// Geovisto core
import {
    ILayerToolState,
    IMapAggregationBucket
} from "../../../../../../index.core";

import { IConnectionLayerToolConfig, IConnectionLayerToolDimensionsConfig } from "./IConnectionLayerToolConfig";
import IConnectionLayerToolDefaults from "./IConnectionLayerToolDefaults";
import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";
import IConnectionLayerToolProps from "./IConnectionLayerToolProps";
/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolState<
    TProps extends IConnectionLayerToolProps = IConnectionLayerToolProps,
    TDefaults extends IConnectionLayerToolDefaults = IConnectionLayerToolDefaults,
    TConfig extends IConnectionLayerToolConfig = IConnectionLayerToolConfig,
    TDimensionsConfig extends IConnectionLayerToolDimensionsConfig = IConnectionLayerToolDimensionsConfig,
    TDimensions extends IConnectionLayerToolDimensions = IConnectionLayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {

    /**
     * It returns a Leaflet SVG layer.
     */
    getSVGLayer(): L.SVG | undefined;

    /**
     * It sets a Leaflet SVG layer.
     * 
     * @param svgLayer 
     */
    setSVGLayer(svgLayer: L.SVG): void;

    /**
     * It returns work data for the force layout algorithm.
     */
    getBucketData(): { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> };

    /**
     * It sets the work data for the force layout algorithm.
     * 
     * @param bucketData 
     */
    setBucketData(bucketData: { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> }): void;
}
export default IConnectionLayerToolState;