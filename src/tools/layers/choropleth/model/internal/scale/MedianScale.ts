// Geovisto core
import {
    MapDomain
} from "../../../../../../index.core";

import IScale from "../../types/scale/IScale";

/**
 * This class provides the median scale.
 * 
 * @author Jiri Hynek
 */
class MedianScale extends MapDomain implements IScale {

    /**
     * It initializes the scale.
     */
    public constructor() {
        super(MedianScale.TYPE());
    }

    /**
     * Type of the scale.
     */
    public static TYPE(): string {
        return "median";
    }
    
    /**
     * It returns a scale which can be used for choropleth color levels.
     * 
     * @param values 
     * @param size 
     */
    public getScale(values: number[], size: number): number[] {
        values.sort(function (a, b) { return a - b; });
        const scale: number[] = values.length > 0 ? [values[0]-1] : [];
        for (let i = 1; i < size; i++) {
            scale.push(values[Math.round(values.length / size * (i))]);
        }
        return scale;
    }
}
export default MedianScale;