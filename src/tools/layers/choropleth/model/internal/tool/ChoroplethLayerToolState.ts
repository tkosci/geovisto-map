import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolState from "../../types/tool/IChoroplethLayerToolState";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IChoroplethLayerToolProps from "../../types/tool/IChoroplethLayerToolProps";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import { IChoroplethLayerToolConfig, IChoroplethLayerToolDimensionsConfig } from "../../types/tool/IChoroplethLayerToolConfig";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import { IMapToolInitProps } from "../../../../../../model/types/tool/IMapToolProps";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolState extends LayerToolState implements IChoroplethLayerToolState {

    private zindex!: number;
    private bucketData!: Map<string, IMapAggregationBucket>;
    private geoJSONlayer: L.GeoJSON | undefined;
    private popup: L.Control | undefined;
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
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation
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
        if(dimensionsConfig.geoData) dimensions.geoData.setDomain(dimensions.geoData.getDomainManager().getDomain(dimensionsConfig.geoData));
        if(dimensionsConfig.geoId) dimensions.geoId.setDomain(dimensions.geoId.getDomainManager().getDomain(dimensionsConfig.geoId));
        if(dimensionsConfig.value) dimensions.value.setDomain(dimensions.value.getDomainManager().getDomain(dimensionsConfig.value));
        if(dimensionsConfig.aggregation) dimensions.aggregation.setDomain(dimensions.aggregation.getDomainManager().getDomain(dimensionsConfig.aggregation));
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
            geoData: dimensions.geoData.getDomain()?.getName(),
            geoId: dimensions.geoId.getDomain()?.getName(),
            value: dimensions.value.getDomain()?.getName(),
            aggregation: dimensions.aggregation.getDomain()?.getName(),
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
     * It returns a Leaflet popup control.
     */
    public getPopup(): L.Control | undefined {
        return this.popup;
    }

    /**
     * It sets a Leaflet popup control.
     * 
     * @param popup 
     */
    public setPopup(popup: L.Control): void {
        this.popup = popup;
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