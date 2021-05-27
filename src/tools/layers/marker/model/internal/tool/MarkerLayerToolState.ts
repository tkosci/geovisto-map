import IMarkerLayerToolState from "../../types/tool/IMarkerLayerToolState";
import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import IMarkerLayerToolProps from "../../types/tool/IMarkerLayerToolProps";
import IMarkerLayerToolDefaults from "../../types/tool/IMarkerLayerToolDefaults";
import { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig } from "../../types/tool/IMarkerLayerToolConfig";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import { IMapToolInitProps } from "../../../../../../model/types/tool/IMapToolProps";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolState extends LayerToolState implements IMarkerLayerToolState {

    private markers!: L.Marker[];
    private bucketData!: Map<string, Map<string, IMapAggregationBucket>>;
    private layerGroup: L.LayerGroup | undefined;
    private centroids: unknown;

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
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension(initProps.map) : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension(initProps.map) : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation,
                category: props.dimensions.category == undefined ? defaults.getCategoryDimension(initProps.map) : props.dimensions.category
            });
        } else {
            this.setDimensions(defaults.getDimensions());
        }

        // the layer tool properties
        this.setMarkers([]);
        this.setCentroids(props.centroids == undefined ? defaults.getCentroids(initProps.map) : props.centroids);
        this.setBucketData(new Map<string, Map<string, IMapAggregationBucket>>());
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
        if(dimensionsConfig.geo) dimensions.geo.setDomain(dimensions.geo.getDomainManager().getDomain(dimensionsConfig.geo));
        if(dimensionsConfig.value) dimensions.value.setDomain(dimensions.value.getDomainManager().getDomain(dimensionsConfig.value));
        if(dimensionsConfig.aggregation) dimensions.aggregation.setDomain(dimensions.aggregation.getDomainManager().getDomain(dimensionsConfig.aggregation));
        if(dimensionsConfig.category) dimensions.category.setDomain(dimensions.category.getDomainManager().getDomain(dimensionsConfig.category));
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
            geo: dimensions.geo.getDomain()?.getName(),
            value: dimensions.value.getDomain()?.getName(),
            aggregation: dimensions.aggregation.getDomain()?.getName(),
            category: dimensions.category.getDomain()?.getName(),
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
     * It returns the centroids.
     * 
     * TODO: specify the type
     */
    public getCentroids(): unknown {
        return this.centroids;
    }

    /**
     * It sets the centroids.
     * 
     * TODO: specify the type
     * 
     * @param centroids 
     */
    public setCentroids(centroids: unknown): void {
        this.centroids = centroids;
    }

    /**
     * It returns the markers.
     */
    public getMarkers(): L.Marker[] {
        return this.markers;
    }

    /**
     * It sets the markers.
     * 
     * @param markers 
     */
    public setMarkers(markers: L.Marker[]): void {
        this.markers = markers;
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