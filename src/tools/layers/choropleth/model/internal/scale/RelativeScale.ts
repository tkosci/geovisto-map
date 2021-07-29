// Geovisto core
import {
    MapDomain
} from "../../../../../../index.core";

import IScale from "../../types/scale/IScale";

/**
 * This class provides the relative [0,max] scale.
 * 
 * @author Jiri Hynek
 */
class RelativeScale extends MapDomain implements IScale {

    /**
     * It initializes the scale.
     */
    public constructor() {
        super(RelativeScale.TYPE());
    }

    /**
     * Type of the scale.
     */
    public static TYPE(): string {
        return "relative [0-max]";
    }
    
    /**
     * It returns a scale which can be used for choropleth color levels.
     * 
     * @param values 
     * @param size 
     */
    public getScale(values: number[], size: number): number[] {
        const scale: number[] = [];
        values.sort(function (a, b) { return a - b; });
        const step = values[values.length - 1] / size;
        scale.push(0);
        for (let i = 1; i < size; i++) {
            scale.push(step * i);
        }
        return scale;
    }
}
export default RelativeScale;