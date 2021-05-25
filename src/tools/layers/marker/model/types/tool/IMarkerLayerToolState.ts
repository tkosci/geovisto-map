import ILayerToolState from "../../../../../../model/types/layer/ILayerToolState";
import IMarkerLayerToolConfig from "./IMarkerLayerToolConfig";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import IMarkerLayerToolDefaults from "./IMarkerLayerToolDefaults";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolState extends ILayerToolState {

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    deserialize(config: IMarkerLayerToolConfig): void;

    /**
     * It sets the marker layer dimensions property of tool state.
     * 
     * @param geo 
     * @param value
     * @param aggregation
     * @param category
     */
    deserializeDimensions(geo: string | undefined, value: string | undefined, aggregation: string | undefined, category: string | undefined): void;

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    serialize(defaults: IMarkerLayerToolDefaults | undefined): IMarkerLayerToolConfig;

    /**
     * It returns the marker layer dimensions property of the tool state.
     */
    getDimensions(): IMarkerLayerToolDimensions;

    /**
     * It sets the marker layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    setDimensions(dimensions: IMarkerLayerToolDimensions): void;

    /**
     * It returns a Leaflet layer group.
     */
    getMarkerLayerGroup(): L.LayerGroup | undefined;

    /**
     * It sets a Leaflet layer group.
     * 
     * @param layerGroup 
     */
    setMarkerLayerGroup(layerGroup: L.LayerGroup): void;

    /**
     * It returns the centroids.
     * 
     * TODO: specify the types
     */
    getCentroids(): unknown;

    /**
     * It sets the centroids.
     * 
     * TODO: specify the types
     * 
     * @param centroids 
     */
    setCentroids(centroids: unknown): void;

    /**
     * It returns the markers.
     */
    getMarkers(): L.Marker[];

    /**
     * It sets the markers.
     * 
     * @param markers 
     */
    setMarkers(markers: L.Marker[]): void;

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    getBucketData(): Map<string, Map<string, IMapAggregationBucket>>;

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    setBucketData(bucketData: Map<string, Map<string, IMapAggregationBucket>>): void;
}
export default IMarkerLayerToolState;