import IConnectionLayerToolConfig from "./IConnectionLayerToolConfig";
import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import IConnectionLayerToolDefaults from "./IConnectionLayerToolDefaults";
import IConnectionLayerToolProps from "./IConnectionLayerToolProps";
import ILayerToolState from "../../../../../../model/types/layer/ILayerToolState";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolState<
    TProps extends IConnectionLayerToolProps = IConnectionLayerToolProps,
    TDefaults extends IConnectionLayerToolDefaults = IConnectionLayerToolDefaults,
    TConfig extends IConnectionLayerToolConfig = IConnectionLayerToolConfig,
    TDimensions extends IConnectionLayerToolDimensions = IConnectionLayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensions> {

    /**
     * It sets the marker layer dimensions property of tool state.
     * 
     * @param from 
     * @param to
     */
    deserializeDimensions(from: string | undefined, to: string | undefined): void;

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
     * It returns the centroids.
     * 
     * TODO: specify the type.
     */
    getCentroids(): unknown;

    /**
     * It sets the centroids.
     * 
     * TODO: specify the type.
     * 
     * @param centroids 
     */
    setCentroids(centroids: unknown): void;

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