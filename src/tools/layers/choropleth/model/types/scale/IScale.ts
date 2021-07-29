import {
    IMapDomain
} from "../../../../../../index.core";

/**
 * This interface declares functions for using choropleth scale.
 * 
 * @author Jiri Hynek
 */
interface IScale extends IMapDomain {

    /**
     * It returns a scale which can be used for choropleth color levels.
     * 
     * @param values 
     * @param size 
     */
    getScale(values: number[], size: number): number[];
}
export default IScale;