// Geovisto core
import {
    IMapAggregationBucket,
    IMapDataDomain,
    IMapToolInitProps,
    LayerToolState
} from "../../../../../../index.core";

import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig } from "../../types/tool/IMarkerLayerToolConfig";
import IMarkerLayerToolDefaults from "../../types/tool/IMarkerLayerToolDefaults";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import IMarkerLayerToolProps from "../../types/tool/IMarkerLayerToolProps";
import IMarkerLayerToolState from "../../types/tool/IMarkerLayerToolState";
import IMarker from "../../types/marker/IMarker";
import { IMarkerIconOptions } from "../../types/marker/IMarkerIconOptions";
import IMarkerIcon from "../../types/marker/IMarkerIcon";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolState extends LayerToolState implements IMarkerLayerToolState {

    private markers!: IMarker<IMarkerIcon<IMarkerIconOptions>>[];
    private currentDataCategories!: string[];
    private bucketData!: Map<string, Map<string, IMapAggregationBucket>>;
    private layerGroup?: L.LayerGroup;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IMarkerLayerTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: IMarkerLayerToolDefaults, props: IMarkerLayerToolProps, initProps: IMapToolInitProps<IMarkerLayerToolConfig>): void {
        // sets map dimensions
        if(props.dimensions) {
            this.setDimensions({
                geoData: props.dimensions.geoData == undefined ? defaults.getGeoDataDimension(initProps.map) : props.dimensions.geoData,
                geoId: props.dimensions.geoId == undefined ? defaults.getGeoIdDimension(initProps.map) : props.dimensions.geoId,
                value: props.dimensions.value == undefined ? defaults.getValueDimension(initProps.map) : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation,
                category: props.dimensions.category == undefined ? defaults.getCategoryDimension(initProps.map) : props.dimensions.category
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }

        // the layer tool properties
        this.setMarkers([]);
        this.setBucketData(new Map<string, Map<string, IMapAggregationBucket>>());

        // set super props
        super.initialize(defaults, props, initProps);

        // set string representations of current data values of category data domain 
        const categoryDomain: IMapDataDomain | undefined = this.getDimensions().category.getValue();
        if(categoryDomain) {
            this.setCurrentDataCategories(initProps.map.getState().getMapData().getDataRecordsValues(
                    categoryDomain, // category data domain
                    initProps.map.getState().getCurrentData() // of current data
                ).map((value: unknown) => new String(value).toString()) // map to string
                .sort()
            );
        } else {
            this.setCurrentDataCategories([]);
        }
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IMarkerLayerToolConfig): void {
        super.deserialize(config);
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param geo 
     * @param value
     * @param aggregation
     * @param category
     */
    public deserializeDimensions(dimensionsConfig: IMarkerLayerToolDimensionsConfig): void {
        const dimensions = this.getDimensions();
        if(dimensionsConfig.geoData) dimensions.geoData.setValue(dimensions.geoData.getDomainManager().getDomain(dimensionsConfig.geoData));
        if(dimensionsConfig.geoId) dimensions.geoId.setValue(dimensions.geoId.getDomainManager().getDomain(dimensionsConfig.geoId));
        if(dimensionsConfig.value) dimensions.value.setValue(dimensions.value.getDomainManager().getDomain(dimensionsConfig.value));
        if(dimensionsConfig.aggregation) dimensions.aggregation.setValue(dimensions.aggregation.getDomainManager().getDomain(dimensionsConfig.aggregation));
        if(dimensionsConfig.category) dimensions.category.setValue(dimensions.category.getDomainManager().getDomain(dimensionsConfig.category));
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IMarkerLayerToolDefaults | undefined): IMarkerLayerToolConfig {
        const config: IMarkerLayerToolConfig = <IMarkerLayerToolConfig> super.serialize(defaults);

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            geoData: dimensions.geoData.getValue()?.getName(),
            geoId: dimensions.geoId.getValue()?.getName(),
            value: dimensions.value.getValue()?.getName(),
            aggregation: dimensions.aggregation.getValue()?.getName(),
            category: dimensions.category.getValue()?.getName(),
        };

        return config;
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IMarkerLayerToolDimensions {
        return super.getDimensions() as IMarkerLayerToolDimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimensions(dimensions: IMarkerLayerToolDimensions): void {
       super.setDimensions(dimensions);
    }

    /**
     * It returns a Leaflet layer group.
     */
    public getMarkerLayerGroup(): L.LayerGroup | undefined {
        return this.layerGroup;
    }

    /**
     * It sets a Leaflet layer group.
     * 
     * @param layerGroup 
     */
    public setMarkerLayerGroup(layerGroup: L.LayerGroup): void {
        this.layerGroup = layerGroup;
    }

    /**
     * It returns the markers.
     */
    public getMarkers(): IMarker<IMarkerIcon<IMarkerIconOptions>>[] {
        return this.markers;
    }

    /**
     * It sets the markers.
     * 
     * @param markers 
     */
    public setMarkers(markers: IMarker<IMarkerIcon<IMarkerIconOptions>>[]): void {
        this.markers = markers;
    }

    /**
     * It returns the current data categories.
     * 
     * @param currentDataCategories 
     */
    public getCurrentDataCategories(): string[] {
        return this.currentDataCategories;
    }

    /**
     * It sets the current data categories.
     * 
     * @param currentDataCategories 
     */
    public setCurrentDataCategories(currentDataCategories: string[]): void {
        this.currentDataCategories = currentDataCategories;
    }

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    public getBucketData(): Map<string, Map<string, IMapAggregationBucket>> {
        return this.bucketData;
    }

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    public setBucketData(bucketData: Map<string, Map<string, IMapAggregationBucket>>): void {
        this.bucketData = bucketData;
    }
}
export default MarkerLayerToolState;