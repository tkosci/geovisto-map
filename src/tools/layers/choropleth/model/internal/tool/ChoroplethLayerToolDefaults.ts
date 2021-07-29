// Geovisto core
import {
    BooleanTypeManager,
    CountAggregationFunction,
    IGeoData,
    IIntegerRangeManager,
    IMap,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapTypeDimension,
    IntegerRangeManager,
    IntegerTypeManager,
    LayerToolDefaults,
    MapDomainDimension,
    MapDomainArrayManager,
    MapDynamicDomainDimension,
    MapTypeDimension,
    SumAggregationFunction,
    StringTypeManager
} from "../../../../../../index.core";

import DecimalScale from "../scale/DecimalScale";
import IChoroplethLayerToolDefaults from "../../types/tool/IChoroplethLayerToolDefaults";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IScale from "../../types/scale/IScale";
import MedianScale from "../scale/MedianScale";
import RelativeMinMaxScale from "../scale/RelativeMinMaxScale";
import RelativeScale from "../scale/RelativeScale";

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
            aggregation: this.getAggregationDimension(),
            customColor: this.getCustomColorDimension(),
            color: this.getColorDimension(),
            range: this.getRangeDimension(),
            scaling: this.getScalingDimension(),
            customMinMax: this.getCustomMinMaxDimension(),
            minValue: this.getMinValueDimension(),
            maxValue: this.getMaxValueDimension()
        };
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoDataDimension(map?: IMap): IMapDomainDimension<IGeoData> {
        return new MapDynamicDomainDimension(
            "geo data",
            () => map?.getState().getGeoDataManager() ?? this.getGeoDataManager(this.getGeoData()),
            ""
        );
    }

    /**
     * It returns the default geo ID dimension.
     */
    public getGeoIdDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "geo id",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    /**
     * It returns the default value dimension.
     */
    public getValueDimension(map?: IMap): IMapDomainDimension<IMapDataDomain> {
        return new MapDynamicDomainDimension(
            "value",
            () => map?.getState().getMapData() ?? this.getDataManager(),
            ""
        );
    }

    /**
     * It returns the default aggregation function dimension.
     */
    public getAggregationDimension(): IMapDomainDimension<IMapAggregationFunction> {
        const domainManager = new MapDomainArrayManager(
            [
                new CountAggregationFunction(),
                new SumAggregationFunction()
            ]
        );

        return new MapDomainDimension(
            "aggregation",
            domainManager,
            domainManager.getDefault()
        );
    }

    /**
     * It returns the animate direction dimension.
     */
    public getCustomColorDimension(): IMapTypeDimension<boolean> {
        return new MapTypeDimension<boolean>(
            "customColor",
            new BooleanTypeManager(),
            undefined
        );
    }

    /**
     * It returns the color dimension.
     */
    public getColorDimension(): IMapTypeDimension<string> {
        return new MapTypeDimension<string>(
            "color",
            new StringTypeManager(),
            "#E32400"
        );
    }

    /**
     * It returns the range dimension.
     */
    public getRangeDimension(): IMapTypeDimension<number, IIntegerRangeManager> {
        return new MapTypeDimension<number, IIntegerRangeManager>(
            "range",
            new IntegerRangeManager(1, 7),
            7
        );
    }

    /**
     * It returns the scaling dimension.
     */
    public getScalingDimension(): IMapDomainDimension<IScale> {
        const domainManager = new MapDomainArrayManager(
            [
                new MedianScale(),
                new RelativeScale(),
                new RelativeMinMaxScale(),
                new DecimalScale(),
            ]
        );

        return new MapDomainDimension(
            "scaling",
            domainManager,
            domainManager.getDefault()
        );
    }

    /**
     * It returns the custom min-max dimension.
     */
    public getCustomMinMaxDimension(): IMapTypeDimension<boolean> {
        return new MapTypeDimension<boolean>(
            "customMinMax",
            new BooleanTypeManager(),
            undefined
        );
    }

    /**
     * It returns the min value dimension.
     */
    public getMinValueDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "minValue",
            new IntegerTypeManager(),
            undefined
        );
    }

    /**
     * It returns the max value dimension.
     */
    public getMaxValueDimension(): IMapTypeDimension<number> {
        return new MapTypeDimension<number>(
            "maxValue",
            new IntegerTypeManager(),
            undefined
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
}
export default ChoroplethLayerToolDefaults;