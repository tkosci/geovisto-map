// Geovisto core
import {
    IMapAggregationBucket,
    ILayerToolState
} from "../../../../../../index.core";

import IMarker from "../marker/IMarker";
import IMarkerIcon from "../marker/IMarkerIcon";
import { IMarkerIconOptions } from "../marker/IMarkerIconOptions";
import { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig } from "./IMarkerLayerToolConfig";
import IMarkerLayerToolDefaults from "./IMarkerLayerToolDefaults";
import IMarkerLayerToolDimensions from "./IMarkerLayerToolDimensions";
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
    getMarkers(): IMarker<IMarkerIcon<IMarkerIconOptions>>[];

    /**
     * It sets the markers.
     * 
     * @param markers 
     */
    setMarkers(markers: IMarker<IMarkerIcon<IMarkerIconOptions>>[]): void;

    /**
     * It returns the current data categories.
     * 
     * @param currentData 
     */
    getCurrentDataCategories(): string[];

    /**
     * It sets the current data categories.
     * 
     * @param currentData 
     */
    setCurrentDataCategories(allCategories: string[]): void;

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    getBucketData(): Map<string, Map<string, IMapAggregationBucket | null>>;

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    setBucketData(bucketData: Map<string, Map<string, IMapAggregationBucket | null>>): void;
}
export default IMarkerLayerToolState;