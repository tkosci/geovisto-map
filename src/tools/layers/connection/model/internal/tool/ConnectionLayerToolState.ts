import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IConnectionLayerToolState from "../../types/tool/IConnectionLayerToolState";
import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import IConnectionLayerToolProps from "../../types/tool/IConnectionLayerToolProps";
import IConnectionLayerToolDefaults from "../../types/tool/IConnectionLayerToolDefaults";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import IConnectionLayerToolConfig from "../../types/tool/IConnectionLayerToolConfig";
import IMap from "../../../../../../model/types/map/IMap";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import { IChoroplethLayerToolDefaults } from "../../../../choropleth";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolState extends LayerToolState implements IConnectionLayerToolState {

    private centroids: unknown;
    private svgLayer: L.SVG | undefined;
    private bucketData: { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> };

    /**
     * It creates a tool state.
     */
    public constructor(tool: IConnectionLayerTool) {
        super(tool);

        const props: IConnectionLayerToolProps = <IConnectionLayerToolProps> this.getProps();
        const defaults: IConnectionLayerToolDefaults = <IConnectionLayerToolDefaults> this.getDefaults();

        // the layer tool properties
        this.centroids = props.centroids; // default centroids are undefined since the map is undefined
        this.bucketData = {
            nodes: new Set<string>(),
            connections: new Map<string, IMapAggregationBucket>()
        };
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props: IConnectionLayerToolProps = <IConnectionLayerToolProps> this.getProps();
        const defaults: IConnectionLayerToolDefaults = <IConnectionLayerToolDefaults> this.getDefaults();

        // sets map dimensions
        if(props.dimensions) {
            this.setDimensions({
                from: props.dimensions.from == undefined ? defaults.getFromDimension() : props.dimensions.from,
                to: props.dimensions.to == undefined ? defaults.getToDimension() : props.dimensions.to
            });
        } else {
            this.setDimensions(defaults.getDimensions());
        }

        // the layer tool properties
        this.setCentroids(props.centroids == undefined ? defaults.getCentroids() : props.centroids);
        this.setBucketData({ nodes: new Set<string>(), connections: new Map<string, IMapAggregationBucket>() });
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IConnectionLayerToolConfig): void {
        super.deserialize(config);

        // the layer tool config
        if(config.data != undefined) {
            this.deserializeDimensions(config.data.from, config.data.to);
        }
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param from 
     * @param to
     */
    public deserializeDimensions(from: string | undefined, to: string | undefined): void {
        const dimensions = this.getDimensions();
        if(from) dimensions.from.setDomain(dimensions.from.getDomainManager().getDomain(from));
        if(to) dimensions.to.setDomain(dimensions.to.getDomainManager().getDomain(to));
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IChoroplethLayerToolDefaults | undefined): IConnectionLayerToolConfig {
        const config: IConnectionLayerToolConfig = <IConnectionLayerToolConfig> super.serialize(defaults);

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            from: dimensions.from.getDomain()?.getName(),
            to: dimensions.to.getDomain()?.getName()
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
        dimensions.from.setDomainManager(map.getState().getMapData());
        dimensions.to.setDomainManager(map.getState().getMapData());

        // map centroids
        if(!this.getCentroids()) {
            this.setCentroids((<IConnectionLayerToolDefaults> this.getDefaults()).getCentroids());
        }
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IConnectionLayerToolDimensions {
        return super.getDimensions() as IConnectionLayerToolDimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimensions(dimensions: IConnectionLayerToolDimensions): void {
       super.setDimensions(dimensions);
    }

    /**
     * It returns a Leaflet SVG layer.
     */
    public getSVGLayer(): L.SVG | undefined {
        return this.svgLayer;
    }

    /**
     * It sets a Leaflet SVG layer.
     * 
     * @param layer 
     */
    public setSVGLayer(svgLayer: L.SVG): void {
        this.svgLayer = svgLayer;
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
     * It returns work data for the force layout algorithm.
     */
    public getBucketData(): { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> } {
        return this.bucketData;
    }

    /**
     * It sets the work data for the force layout algorithm.
     * 
     * @param workData 
     */
    public setBucketData(bucketData: { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> }): void {
        this.bucketData = bucketData;
    }
}
export default ConnectionLayerToolState;