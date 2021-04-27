import ILayerToolDefaults from "../../../../../../model/types/layer/ILayerToolDefaults";
import IConnectionLayerToolDimensions from "./IConnectionLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";

/**
 * This interface declares functions which return the default state values.
 * 
 * @author Jiri Hynek
 */
interface IConnectionLayerToolDefaults extends ILayerToolDefaults {

    /**
     * It returns the map of layer dimensions.
     */
    getDimensions(): IConnectionLayerToolDimensions;

    /**
     * It returns the default geo ID dimension.
     */
    getFromDimension(): IMapDimension<IMapDataDomain>;

    /**
     * It returns the default value dimension.
     */
    getToDimension(): IMapDimension<IMapDataDomain>;
    
    /**
     * It returns optiomal zoom for D3 projections.
     */
    getProjectionZoom(): number;
    
    /**
     * It returns default centroids.
     */
    getCentroids(): any;
}
export default IConnectionLayerToolDefaults;