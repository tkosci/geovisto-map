import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import IMarkerLayerToolDefaults from "../../types/tool/IMarkerLayerToolDefaults";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import SumAggregationFunction from "../../../../../../model/internal/aggregation/basic/SumAggregationFunction";
import CountAggregationFunction from "../../../../../../model/internal/aggregation/basic/CountAggregationFunction";
import IMap from "../../../../../../model/types/map/IMap";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolDefaults extends LayerToolDefaults implements IMarkerLayerToolDefaults {

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-marker";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return MarkerLayerToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Marker layer";
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): IMarkerLayerToolDimensions {
        return {
            geo: this.getGeoDimension(map),
            value: this.getValueDimension(map),
            aggregation: this.getAggregationDimension(),
            category: this.getCategoryDimension(map)
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
                new CountAggregationFunction(),
                new SumAggregationFunction()
            ]
        );

        return new MapDimension(
            "aggregation",
            domainManager,
            domainManager.getDefault()
        );
    }

    /**
     * It returns the default category dimension.
     */
    public getCategoryDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "category",
            map?.getState().getMapData() ?? this.getDataManager(),
            undefined
        );
    }
    
    /**
     * It returns default centroids.
     * 
     * TODO: specify the type
     */
    public getCentroids(map?: IMap): unknown {
        return JSON.parse(JSON.stringify(map?.getState().getCentroids() ?? {}));
    }
}
export default MarkerLayerToolDefaults;