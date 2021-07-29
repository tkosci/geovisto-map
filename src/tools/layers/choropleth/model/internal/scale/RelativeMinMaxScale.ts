// Geovisto core
import {
    MapDomain
} from "../../../../../../index.core";

import IScale from "../../types/scale/IScale";

/**
 * This class provides the relative [min,max] scale.
 * 
 * @author Jiri Hynek
 */
class RelativeMinMaxScale extends MapDomain implements IScale {

    /**
     * It initializes the scale.
     */
    public constructor() {
        super(RelativeMinMaxScale.TYPE());
    }

    /**
     * Type of the scale.
     */
    public static TYPE(): string {
        return "relative [min-max]";
    }
    
    /**
     * It returns a scale which can be used for choropleth color levels.
     * 
     * @param values 
     * @param size 
     */
    public getScale(values: number[], size: number): number[] {
        const scale: number[] = [ ];
        values.sort(function (a, b) { return a - b; });
        const step = (values[values.length - 1] - values[0]) / size;
        scale.push(values[0]-1);
        for (let i = 1; i < size; i++) {
            scale.push(step * i);
        }
        return scale;
    }
}
export default RelativeMinMaxScale;