import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import IMarkerLayerToolDefaults from "../../types/tool/IMarkerLayerToolDefaults";
import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import SumAggregationFunction from "../../../../../../model/internal/aggregation/basic/SumAggregationFunction";
import CountAggregationFunction from "../../../../../../model/internal/aggregation/basic/CountAggregationFunction";
import { GeovistoMarkerLayerTool } from "../../..";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolDefaults extends LayerToolDefaults implements IMarkerLayerToolDefaults {

    /**
     * It initializes tool defaults.
     */
    public constructor(tool: IMarkerLayerTool) {
        super(tool);
    }

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return GeovistoMarkerLayerTool.getType();
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
    public getDimensions(): IMarkerLayerToolDimensions {
        return {
            geo: this.getGeoDimension(),
            value: this.getValueDimension(),
            aggregation: this.getAggregationDimension(),
            category: this.getCategoryDimension()
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "geo",
            this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the default value dimension.
     */
    public getValueDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "value",
            this.getDataManager(),
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
     * It returns the default category dimension.
     */
    public getCategoryDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "category",
            this.getDataManager(),
            undefined
        );
    }
    
    /**
     * It returns default centroids.
     * 
     * TODO: specify the type
     */
    public getCentroids(): unknown {
        return JSON.parse(JSON.stringify(this.getMapObject().getMap()?.getState().getCentroids()));
    }
}
export default MarkerLayerToolDefaults;