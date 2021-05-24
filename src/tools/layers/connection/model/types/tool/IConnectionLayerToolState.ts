import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IConnectionLayerToolConfig from "./IConnectionLayerToolConfig";
import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolState extends LayerToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: IConnectionLayerToolConfig): void;

    /**
     * It sets the marker layer dimensions property of tool state.
     * 
     * @param from 
     * @param to
     */
    deserializeDimensions(from: string | undefined, to: string | undefined): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    serialize(filterDefaults: boolean): IConnectionLayerToolConfig;

    /**
     * It returns the connection layer dimensions property of the tool state.
     */
    getDimensions(): IConnectionLayerToolDimensions;

    /**
     * It sets the connection layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    setDimensions(dimensions: IConnectionLayerToolDimensions): void;

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