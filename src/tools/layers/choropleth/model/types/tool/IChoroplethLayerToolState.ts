import IChoroplethLayerToolConfig from "./IChoroplethLayerToolConfig";
import IChoroplethLayerToolDimensions from "./IChoroplethLayerToolDimensions";
import ILayerToolState from "../../../../../../model/types/layer/ILayerToolState";
import IMapAggregationBucket from "../../../../../../model/types/aggregation/IMapAggregationBucket";
import IChoroplethLayerToolDefaults from "./IChoroplethLayerToolDefaults";
import IChoroplethLayerToolProps from "./IChoroplethLayerToolProps";

/**
 * This interface declares functions for using the state of the layer tool.
 * 
 * @author Jiri Hynek
 */
interface IChoroplethLayerToolState<
    TProps extends IChoroplethLayerToolProps = IChoroplethLayerToolProps,
    TDefaults extends IChoroplethLayerToolDefaults = IChoroplethLayerToolDefaults,
    TConfig extends IChoroplethLayerToolConfig = IChoroplethLayerToolConfig,
    TDimensions extends IChoroplethLayerToolDimensions = IChoroplethLayerToolDimensions
> extends ILayerToolState<TProps, TDefaults, TConfig, TDimensions> {

    /**
     * It sets the marker layer dimensions property of tool state.
     * 
     * @param geo 
     * @param value
     * @param aggregation
     */
    deserializeDimensions(geo: string | undefined, value: string | undefined, aggregation: string | undefined): void;

    /**
     * It returns the choropleth layer dimensions property of the tool state.
     */
    getDimensions(): IChoroplethLayerToolDimensions;

    /**
     * It sets the choropleth layer dimensions property of tool state.
     * 
     * @param dimensions 
     */
    setDimensions(dimensions: IChoroplethLayerToolDimensions): void;

    /**
     * It returns a Leaflet geoJSON layer.
     */
    getGeoJSONLayer(): L.GeoJSON | undefined;

    /**
     * It sets a Leaflet geoJSON layer.
     * 
     * @param layer 
     */
    setGeoJSONLayer(layer: L.GeoJSON): void;

    /**
     * It returns a Leaflet popup control.
     */
    getPopup(): L.Control | undefined;

    /**
     * It sets a Leaflet popup control.
     * 
     * @param popup 
     */
    setPopup(popup: L.Control): void;

    /**
     * It returns the polygons.
     * 
     * TODO: specify the type
     */
    getPolygons(): unknown;

    /**
     * It sets the polygons.
     * 
     * TODO: specify the type
     * 
     * @param polygons 
     */
    setPolygons(polygons: unknown): void;

    /**
     * It returns the hovered item.
     * 
     * TODO: specify the type
     */
    getHoveredItem(): unknown;

    /**
     * It sets the hovered item.
     * 
     * TODO: specify the type
     * 
     * @param hoveredItem 
     */
    setHoveredItem(hoveredItem: unknown): void;

    /**
     * It returns the z index.
     */
    getZIndex(): number;

    /**
     * It sets the z index.
     * 
     * @param zindex 
     */
    setZIndex(zindex: number): void;

    /**
     * It returns the bucket data.
     * 
     * @param bucketData 
     */
    getBucketData(): Map<string, IMapAggregationBucket>;

    /**
     * It sets the bucket data.
     * 
     * @param bucketData 
     */
    setBucketData(bucketData: Map<string, IMapAggregationBucket>): void;
}
export default IChoroplethLayerToolState;