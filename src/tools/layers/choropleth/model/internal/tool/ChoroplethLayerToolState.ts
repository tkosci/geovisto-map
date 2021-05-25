import LayerToolState from "../../../../../../model/internal/layer/LayerToolState";
import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolState from "../../types/tool/IChoroplethLayerToolState";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IChoroplethLayerToolProps from "../../types/tool/IChoroplethLayerToolProps";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IMap from "../../../../../../model/types/map/IMap";
import IChoroplethLayerToolConfig from "../../types/tool/IChoroplethLayerToolConfig";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";

/**
 * This class provide functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolState extends LayerToolState implements IChoroplethLayerToolState {

    private geoJSONlayer: L.GeoJSON | undefined;
    private popup: L.Control | undefined;
    private polygons: unknown; // TODO: specify the type
    private hoveredItem: unknown; // TODO: specify the type
    private zindex: number;
    private bucketData: Map<string, IMapAggregationBucket>;

    /**
     * It creates a tool state.
     */
    public constructor(tool: IChoroplethLayerTool) {
        super(tool);

        const props: IChoroplethLayerToolProps = <IChoroplethLayerToolProps> this.getProps();
        const defaults: IChoroplethLayerToolDefaults = <IChoroplethLayerToolDefaults> this.getDefaults();

        // sets map dimensions
        if(props.dimensions) {
            this.setDimensions({
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension() : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension() : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation
            });
        } else {
            this.setDimensions(defaults.getDimensions());
        }

        // set other state props
        this.polygons = props.polygons; // default polygons are undefined since the map is undefined
        this.hoveredItem = undefined;
        this.zindex = defaults.getZIndex();
        this.bucketData = new Map<string, IMapAggregationBucket>();
    }

    /**
     * It resets state with respect to initial props.
     */
    public reset(): void {
        super.reset();

        const props = <IChoroplethLayerToolProps> this.getProps();
        const defaults = <IChoroplethLayerToolDefaults> this.getDefaults();

        // the choropleth layer tool properties
        if(props.dimensions) {
            this.setDimensions({
                geo: props.dimensions.geo == undefined ? defaults.getGeoDimension() : props.dimensions.geo,
                value: props.dimensions.value == undefined ? defaults.getValueDimension() : props.dimensions.value,
                aggregation: props.dimensions.aggregation == undefined ? defaults.getAggregationDimension() : props.dimensions.aggregation
            });
        } else {
            this.setDimensions(defaults.getDimensions());
        }
        this.setPolygons(props.polygons == undefined ? defaults.getPolygons() : props.polygons);
        this.setHoveredItem(undefined);
        this.setZIndex(defaults.getZIndex());
        this.setBucketData(new Map<string, IMapAggregationBucket>());
    }

    /**
     * The metod takes config and deserializes the values.
     * 
     * @param config 
     */
    public deserialize(config: IChoroplethLayerToolConfig): void {
        super.deserialize(config);
        
        // the layer tool config
        if(config.data != undefined) {
            this.deserializeDimensions(config.data.geo, config.data.value, config.data.aggregation);
        }
    }

    /**
     * It sets the map layer dimensions property of tool state.
     * 
     * @param geo 
     * @param value
     * @param aggregation
     */
    public deserializeDimensions(geo: string | undefined, value: string | undefined, aggregation: string | undefined): void {
        const dimensions = this.getDimensions();
        if(geo) dimensions.geo.setDomain(dimensions.geo.getDomainManager().getDomain(geo));
        if(value) dimensions.value.setDomain(dimensions.value.getDomainManager().getDomain(value));
        if(aggregation) dimensions.aggregation.setDomain(dimensions.aggregation.getDomainManager().getDomain(aggregation));
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
            geo: dimensions.geo.getDomain()?.getName(),
            value: dimensions.value.getDomain()?.getName(),
            aggregation: dimensions.aggregation.getDomain()?.getName(),
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

        // map polygons
        if(!this.getPolygons()) {
            this.setPolygons((<IChoroplethLayerToolDefaults> this.getDefaults()).getPolygons());
        }
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
     * It returns the polygons.
     * 
     * TODO: specify the type
     */
    public getPolygons(): unknown {
        return this.polygons;
    }

    /**
     * It sets the polygons.
     * 
     * TODO: specify the type
     * 
     * @param polygons 
     */
    public setPolygons(polygons: unknown): void {
        this.polygons = polygons;
    }

    /**
     * It returns the hovered item.
     * 
     * TODO: specify the type
     */
    public getHoveredItem(): unknown {
        return this.hoveredItem;
    }

    /**
     * It sets the hovered item.
     * 
     * TODO: specify the type
     * 
     * @param hoveredItem 
     */
    public setHoveredItem(hoveredItem: unknown): void {
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