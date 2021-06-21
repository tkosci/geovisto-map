// Geovisto core
import CountAggregationFunction from "../../../../../../model/internal/aggregation/basic/CountAggregationFunction";
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import IMap from "../../../../../../model/types/map/IMap";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import MapDomainArrayManager from "../../../../../../model/internal/domain/generic/MapDomainArrayManager";
import SumAggregationFunction from "../../../../../../model/internal/aggregation/basic/SumAggregationFunction";

import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerToolDefaults extends LayerToolDefaults implements IChoroplethLayerToolDefaults {

    /**
     * Static tool type constant.
     */
    public static TYPE = "geovisto-tool-layer-choropleth";

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return ChoroplethLayerToolDefaults.TYPE;
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Choropleth layer";
    }

    /**
     * It returns the label of the tool.
     */
    public getLabel(): string {
        return this.getLayerName();
    }

    /**
     * It returns the icon of the tool.
     */
    public getIcon(): string {
        return '<i class="fa fa-th-large"></i>';
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(map?: IMap): IChoroplethLayerToolDimensions {
        return {
            geoData: this.getGeoDataDimension(map),
            geoId: this.getGeoIdDimension(map),
            value: this.getValueDimension(map),
            aggregation: this.getAggregationDimension()
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDataDimension(map?: IMap): IMapDimension<IGeoData> {
        return new MapDimension(
            "geo data",
            map?.getState().getGeoDataManager() ?? this.getGeoDataManager(this.getGeoData()),
            undefined
        );
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoIdDimension(map?: IMap): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "geo id",
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
     * It returns the default geo data.
     */
    public getGeoData(): IGeoData[] {
        return [
            // TODO: provide default geo data
        ];
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