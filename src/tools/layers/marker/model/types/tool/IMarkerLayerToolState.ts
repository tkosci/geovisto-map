import ILayerToolState from "../../../../../../model/types/layer/ILayerToolState";
import { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig } from "./IMarkerLayerToolConfig";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import IMarkerLayerToolDefaults from "./IMarkerLayerToolDefaults";
import IMarkerLayerToolProps from "./IMarkerLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IMarkerLayerToolState<
    TProps extends IMarkerLayerToolProps = IMarkerLayerToolProps,
    TDefaults extends IMarkerLayerToolDefaults = IMarkerLayerToolDefaults,
    TConfig extends IMarkerLayerToolConfig = IMarkerLayerToolConfig,
    TDimensionsConfig extends IMarkerLayerToolDimensionsConfig = IMarkerLayerToolDimensionsConfig,
    TDimensions extends IMarkerLayerToolDimensions = IMarkerLayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensionsConfig, TDimensions> {

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