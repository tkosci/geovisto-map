import IMarkerLayerToolState from "../../types/tool/IMarkerLayerToolState";
import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import IMarkerLayerToolProps from "../../types/tool/IMarkerLayerToolProps";
import IMarkerLayerToolDefaults from "../../types/tool/IMarkerLayerToolDefaults";
import IMarkerLayerToolConfig from "../../types/tool/IMarkerLayerToolConfig";
import IMap from "../../../../../../model/types/map/IMap";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolState extends LayerToolState implements IMarkerLayerToolState {

    private dimensions: IMarkerLayerToolDimensions;
    private markers: L.Marker[];
    private layerGroup: L.LayerGroup | undefined;
    private centroids: any;
    private bucketData: Map<string, Map<string, IMapAggregationBucket>>;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IMarkerLayerTool) {
        super(tool);

        const props: IMarkerLayerToolProps = <IMarkerLayerToolProps> this.getProps();
        const defaults: IMarkerLayerToolDefaults = <IMarkerLayerToolDefaults> this.getDefaults();

        // sets map dimensions
        if(props.dimensions) {
            this.dimensions = {
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension() : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension() : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation,
                category: props.dimensions.category == undefined ? defaults.getCategoryDimension() : props.dimensions.category
            };
        } else {
            this.dimensions = defaults.getDimensions();
        }

        // the layer tool properties
        this.markers = [];
        this.centroids = props.centroids; // default centroids are undefined since the map is undefined
        this.layerGroup = undefined;
        this.bucketData = new Map<string, Map<string, IMapAggregationBucket>>();
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props: IMarkerLayerToolProps = <IMarkerLayerToolProps> this.getProps();
        const defaults: IMarkerLayerToolDefaults = <IMarkerLayerToolDefaults> this.getDefaults();

        // sets map dimensions
        if(props.dimensions) {
            this.dimensions = {
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension() : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension() : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation,
                category: props.dimensions.category == undefined ? defaults.getCategoryDimension() : props.dimensions.category
            };
        } else {
            this.dimensions = defaults.getDimensions();
        }

        // the layer tool properties
        this.setMarkers([]);
        this.setCentroids(props.centroids == undefined ? defaults.getCentroids() : props.centroids);
        this.setBucketData(new Map<string, Map<string, IMapAggregationBucket>>());
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IMarkerLayerToolConfig): void {
        super.deserialize(config);

        // the layer tool config
        if(config.data != undefined) {
            this.deserializeDimensions(config.data.geo, config.data.value, config.data.aggregation, config.data.category);
        }
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param geo 
     * @param value
     * @param aggregation
     * @param category
     */
    public deserializeDimensions(geo: string | undefined, value: string | undefined, aggregation: string | undefined, category: string | undefined): void {
        const dimensions = this.getDimensions();
        if(geo) dimensions.geo.setDomain(dimensions.geo.getDomainManager().getDomain(geo));
        if(value) dimensions.value.setDomain(dimensions.value.getDomainManager().getDomain(value));
        if(aggregation) dimensions.aggregation.setDomain(dimensions.aggregation.getDomainManager().getDomain(aggregation));
        if(category) dimensions.category.setDomain(dimensions.category.getDomainManager().getDomain(category));
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param filterDefaults
     */
    public serialize(filterDefaults: boolean): IMarkerLayerToolConfig {
        const config: IMarkerLayerToolConfig = <IMarkerLayerToolConfig> super.serialize(filterDefaults);

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
     * It sets the map property of the tool state.
     * 
     * Also, it updates map-related properties.
     * 
     * @param map  
     */
    public setMap(map: IMap): void {
        super.setMap(map);

        // update dimensions' data domain managers
        const dimensions = this.getDimensions();
        dimensions.geo.setDomainManager(map.getState().getMapData());
        dimensions.value.setDomainManager(map.getState().getMapData());
        dimensions.category.setDomainManager(map.getState().getMapData());

        // map centroids
        if(!this.getCentroids()) {
            this.setCentroids((<IMarkerLayerToolDefaults> this.getDefaults()).getCentroids());
        }
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IMarkerLayerToolDimensions {
        return this.dimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimension(dimensions: IMarkerLayerToolDimensions): void {
       this.dimensions = dimensions;
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
    public getCentroids(): any {
        return this.centroids;
    }

    /**
     * It sets the centroids.
     * 
     * TODO: specify the type
     * 
     * @param centroids 
     */
    public setCentroids(centroids: any): void {
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