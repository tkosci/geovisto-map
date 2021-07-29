// Geovisto core
import {
    IMapAggregationBucket,
    IMapToolInitProps,
    LayerToolState
} from "../../../../../../index.core";

import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import { IChoroplethLayerToolConfig, IChoroplethLayerToolDimensionsConfig } from "../../types/tool/IChoroplethLayerToolConfig";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IChoroplethLayerToolProps from "../../types/tool/IChoroplethLayerToolProps";
import IChoroplethLayerToolState from "../../types/tool/IChoroplethLayerToolState";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolState extends LayerToolState implements IChoroplethLayerToolState {

    private zindex!: number;
    private bucketData!: Map<string, IMapAggregationBucket>;
    private geoJSONlayer?: L.GeoJSON;
    private hoveredItem?: string;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IChoroplethLayerTool) {
        super(tool);
    }

    /**
     * It resets state with respect to initial props.
     * 
     * @param defaults 
     * @param props 
     * @param initProps 
     */
    public initialize(defaults: IChoroplethLayerToolDefaults, props: IChoroplethLayerToolProps, initProps: IMapToolInitProps<IChoroplethLayerToolConfig>): void {
        // the choropleth layer tool properties
        if(props.dimensions) {
            this.setDimensions({
                geoData: props.dimensions.geoData == undefined ? defaults.getGeoDataDimension(initProps.map) : props.dimensions.geoData,
                geoId: props.dimensions.geoId == undefined ? defaults.getGeoIdDimension(initProps.map) : props.dimensions.geoId,
                value: props.dimensions.value == undefined ? defaults.getValueDimension(initProps.map) : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation,
                customColor: props.dimensions.customColor == undefined ? defaults.getCustomColorDimension() : props.dimensions.customColor,
                color: props.dimensions.color == undefined ? defaults.getColorDimension() : props.dimensions.color,
                range: props.dimensions.range == undefined ? defaults.getRangeDimension() : props.dimensions.range,
                scaling: props.dimensions.scaling == undefined ? defaults.getScalingDimension() : props.dimensions.scaling,
                customMinMax: props.dimensions.customMinMax == undefined ? defaults.getCustomMinMaxDimension() : props.dimensions.customMinMax,
                minValue: props.dimensions.minValue == undefined ? defaults.getMinValueDimension() : props.dimensions.minValue,
                maxValue: props.dimensions.maxValue == undefined ? defaults.getMaxValueDimension() : props.dimensions.maxValue,
            });
        } else {
            this.setDimensions(defaults.getDimensions(initProps.map));
        }
        this.setHoveredItem(undefined);
        this.setZIndex(defaults.getZIndex());
        this.setBucketData(new Map<string, IMapAggregationBucket>());

        // set super props
        super.initialize(defaults, props, initProps);
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IChoroplethLayerToolConfig): void {
        super.deserialize(config);
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensionsConfig
     */
    public deserializeDimensions(dimensionsConfig: IChoroplethLayerToolDimensionsConfig): void {
        const dimensions = this.getDimensions();
        if(dimensionsConfig.geoData) dimensions.geoData.setValue(dimensions.geoData.getDomainManager().getDomain(dimensionsConfig.geoData));
        if(dimensionsConfig.geoId) dimensions.geoId.setValue(dimensions.geoId.getDomainManager().getDomain(dimensionsConfig.geoId));
        if(dimensionsConfig.value) dimensions.value.setValue(dimensions.value.getDomainManager().getDomain(dimensionsConfig.value));
        if(dimensionsConfig.aggregation) dimensions.aggregation.setValue(dimensions.aggregation.getDomainManager().getDomain(dimensionsConfig.aggregation));
        if(dimensionsConfig.customColor !== undefined) dimensions.customColor.setValue(dimensionsConfig.customColor);
        if(dimensionsConfig.color) dimensions.color.setValue(dimensionsConfig.color);
        if(dimensionsConfig.range !== undefined) dimensions.range.setValue(dimensionsConfig.range);
        if(dimensionsConfig.scaling) dimensions.scaling.setValue(dimensions.scaling.getDomainManager().getDomain(dimensionsConfig.scaling));
        if(dimensionsConfig.customMinMax !== undefined) dimensions.customMinMax.setValue(dimensionsConfig.customMinMax);
        if(dimensionsConfig.minValue !== undefined) dimensions.minValue.setValue(dimensionsConfig.minValue);
        if(dimensionsConfig.maxValue !== undefined) dimensions.maxValue.setValue(dimensionsConfig.maxValue);
        
    }

    /**
     * The method serializes the tool state. Optionally, defaults can be set if property is undefined.
     * 
     * @param defaults
     */
    public serialize(defaults: IChoroplethLayerToolDefaults | undefined): IChoroplethLayerToolConfig {
        const config: IChoroplethLayerToolConfig = <IChoroplethLayerToolConfig> super.serialize(defaults);

        // serialize the layer tool properties
        const dimensions = this.getDimensions();
        config.data = {
            geoData: dimensions.geoData.getValue()?.getName(),
            geoId: dimensions.geoId.getValue()?.getName(),
            value: dimensions.value.getValue()?.getName(),
            aggregation: dimensions.aggregation.getValue()?.getName(),
            customColor: dimensions.customColor.getValue(),
            color: dimensions.color.getValue(),
            range: dimensions.range.getValue(),
            scaling: dimensions.scaling.getValue()?.getName(),
            customMinMax: dimensions.customMinMax.getValue(),
            minValue: dimensions.minValue.getValue(),
            maxValue: dimensions.maxValue.getValue()
        };

        return config;
    }

    /**
     * It returns the map layer dimensions property of the tool state.
     */
    public getDimensions(): IChoroplethLayerToolDimensions {
        return super.getDimensions() as IChoroplethLayerToolDimensions;
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    public setDimensions(dimensions: IChoroplethLayerToolDimensions): void {
       super.setDimensions(dimensions);
    }

    /**
     * It returns a Leaflet geoJSON layer.
     */
    public getGeoJSONLayer(): L.GeoJSON | undefined {
        return this.geoJSONlayer;
    }

    /**
     * It sets a Leaflet geoJSON layer.
     * 
     * @param layer 
     */
    public setGeoJSONLayer(geoJSONlayer: L.GeoJSON): void {
        this.geoJSONlayer = geoJSONlayer;
    }

    /**
     * It returns the hovered item.
     */
    public getHoveredItem(): string | undefined {
        return this.hoveredItem;
    }

    /**
     * It sets the hovered item.
     * 
     * @param hoveredItem 
     */
    public setHoveredItem(hoveredItem: string | undefined): void {
        this.hoveredItem = hoveredItem;
    }

    /**
     * It returns the z index.
     */
    public getZIndex(): number {
        return this.zindex;
    }

    /**
     * It sets the z index.
     * 
     * @param zindex 
     */
    public setZIndex(zindex: number): void {
        this.zindex = zindex;
    }

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    public getBucketData(): Map<string, IMapAggregationBucket> {
        return this.bucketData;
    }

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    public setBucketData(bucketData: Map<string, IMapAggregationBucket>): void {
        this.bucketData = bucketData;
    }
}
export default ChoroplethLayerToolState;