import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import SumAggregationFunction from "../../../../../../model/internal/aggregation/basic/SumAggregationFunction";
import CountAggregationFunction from "../../../../../../model/internal/aggregation/basic/CountAggregationFunction";
import { GeovistoChoroplethLayerTool } from "../../..";
import IMap from "../../../../../../model/types/map/IMap";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolDefaults extends LayerToolDefaults implements IChoroplethLayerToolDefaults {

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return GeovistoChoroplethLayerTool.getType();
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Choropleth layer";
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): IChoroplethLayerToolDimensions {
        return {
            geo: this.getGeoDimension(map),
            value: this.getValueDimension(map),
            aggregation: this.getAggregationDimension()
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "geo",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default value dimension.
     */
    public getValueDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "value",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default aggregation function dimension.
     */
    public getAggregationDimension(): IMapDimension<IMapAggregationFunction> {
        const domainManager = new MapDomainArrayManager(
            [
                new SumAggregationFunction(),
                new CountAggregationFunction()
            ]
        );

        return new MapDimension(
            "aggregation",
            domainManager,
            domainManager.getDefault()
        );
    }
    
    /**
     * It returns default centroids.
     * 
     * TODO: specify the type
     */
    public getPolygons(map?: IMap): unknown {
        return map?.getState().getPolygons() ?? {};
    }

    /**
     * It returns preferred z index for the choropoleth layer.
     */
    public getZIndex(): number {
        return 350;
    }

    /**
     * It returns the values scale.
     */
    public getScale(): number[] {
        return [1, 100, 1000, 10000, 100000, 1000000, 10000000];
    }
}
export default ChoroplethLayerToolDefaults;