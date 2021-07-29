// Geovisto core
import {
    MapDomain   
} from "../../../../../../index.core";

import IScale from "../../types/scale/IScale";

/**
 * This class provides the decimal scale.
 * 
 * @author Jiri Hynek
 */
class DecimalScale extends MapDomain implements IScale {

    /**
     * It initializes the scale.
     */
    public constructor() {
        super(DecimalScale.TYPE());
    }

    /**
     * Type of the scale.
     */
    public static TYPE(): string {
        return "decimal [0,max]";
    }
    
    /**
     * It returns a scale which can be used for choropleth color levels.
     * 
     * @param values 
     * @param size 
     */
    public getScale(values: number[], size: number): number[] {
        // find max value
        const max = values.reduce(function(prev, current) {
            return (prev > current) ? prev : current;
        });

        // get decimal logarithm
        const log = Math.round(Math.log10(max));

        // calculate scale step
        const step = Math.pow(10,Math.round(size/log));

        // construct scale
        const scale = [ 0 ];
        for(let i = 1, acc = 1; i < size; i++) {
            scale.push(acc);
            acc *= step;
        }

        return scale;
    }
}
export default DecimalScale;