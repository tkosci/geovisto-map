import LayerToolDefaults from "../../../../../../model/internal/layer/LayerToolDefaults";
import IConnectionLayerToolDefaults from "../../types/tool/IConnectionLayerToolDefaults";
import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import MapDimension from "../../../../../../model/internal/dimension/MapDimension";
import { GeovistoConnectionLayerTool } from "../../..";

/**
 * This class provide functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolDefaults extends LayerToolDefaults implements IConnectionLayerToolDefaults {

    /**
     * It returns a unique type string of the tool which is based on the layer it wraps.
     */
    public getType(): string {
        return GeovistoConnectionLayerTool.getType();
    }

    /**
     * It returns the layer name.
     */
    public getLayerName(): string {
        return "Connection layer";
    }

    /**
     * It returns the map of layer dimensions.
     */
    public getDimensions(): IConnectionLayerToolDimensions {
        return {
            from: this.getFromDimension(),
            to: this.getToDimension(),
        };
    }

    /**
     * It returns the source geo ID dimension.
     */
    public getFromDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "from",
            this.getDataManager(),
            undefined
        );
    }

    /**
     * It returns the target geo ID dimension.
     */
    public getToDimension(): IMapDimension<IMapDataDomain> {
        return new MapDimension(
            "to",
            this.getDataManager(),
            undefined
        );
    }
    
    /**
     * It returns optiomal zoom for D3 projections.
     */
    public getProjectionZoom(): number {
        return 2;
    }
    
    /**
     * It returns default centroids.
     * 
     * TODO: specify the type
     */
    public getCentroids(): unknown {
        return {};
    }
}
export default ConnectionLayerToolDefaults;