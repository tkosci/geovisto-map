// Geovisto core
import {
    IMapAggregationBucket,
    IMapToolInitProps,
    LayerToolState
} from "../../../../../../index.core";

import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import { IConnectionLayerToolConfig, IConnectionLayerToolDimensionsConfig } from "../../types/tool/IConnectionLayerToolConfig";
import IConnectionLayerToolDefaults from "../../types/tool/IConnectionLayerToolDefaults";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import IConnectionLayerToolProps from "../../types/tool/IConnectionLayerToolProps";
import IConnectionLayerToolState from "../../types/tool/IConnectionLayerToolState";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolState extends LayerToolState implements IConnectionLayerToolState {

    private svgLayer?: L.SVG;
    private bucketData!: { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> };

    /**
     * It creates a tool state.
     */
    public constructor(tool: IConnectionLayerTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: IConnectionLayerToolDefaults, props: IConnectionLayerToolProps, initProps: IMapToolInitProps<IConnectionLayerToolConfig>): void {
        // sets map dimensions
        if(props.dimensions) {
            this.setDimensions({
                geoData: props.dimensions.geoData == undefined ? defaults.getGeoDataDimension(initProps.map) : props.dimensions.geoData,
                from: props.dimensions.from == undefined ? defaults.getFromDimension(initProps.map) : props.dimensions.from,
                to: props.dimensions.to == undefined ? defaults.getToDimension(initProps.map) : props.dimensions.to,
                direction: props.dimensions.direction == undefined ? defaults.getDirectionDimension() : props.dimensions.direction,
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }

        // the layer tool properties
        this.setBucketData({ nodes: new Set<string>(), connections: new Map<string, IMapAggregationBucket>() });
        
        // initialize bucket data
        this.bucketData = {
            nodes: new Set<string>(),
            connections: new Map<string, IMapAggregationBucket>()
        };

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IConnectionLayerToolConfig): void {
        super.deserialize(config);
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param from 
     * @param to
     */
    public deserializeDimensions(dimensionsConfig: IConnectionLayerToolDimensionsConfig): void {
        const dimensions = this.getDimensions();
        if(dimensionsConfig.geoData) dimensions.geoData.setValue(dimensions.geoData.getDomainManager().getDomain(dimensionsConfig.geoData));
        if(dimensionsConfig.from) dimensions.from.setValue(dimensions.from.getDomainManager().getDomain(dimensionsConfig.from));
        if(dimensionsConfig.to) dimensions.to.setValue(dimensions.to.getDomainManager().getDomain(dimensionsConfig.to));
        if(dimensionsConfig.direction !== undefined) dimensions.direction.setValue(dimensionsConfig.direction);
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IConnectionLayerToolDefaults | undefined): IConnectionLayerToolConfig {
        const config: IConnectionLayerToolConfig = <IConnectionLayerToolConfig> super.serialize(defaults);

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            geoData: dimensions.geoData.getValue()?.getName(),
            from: dimensions.from.getValue()?.getName(),
            to: dimensions.to.getValue()?.getName(),
            direction: dimensions.direction.getValue()
        };

        return config;
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