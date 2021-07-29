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
class CustomMinMaxScale extends MapDomain implements IScale {
    
    private min: number;
    private max: number;

    /**
     * It initializes the scale.
     */
    public constructor(min: number, max: number) {
        super(CustomMinMaxScale.TYPE());
        this.min = min;
        this.max = max;
    }

    /**
     * Type of the scale.
     */
    public static TYPE(): string {
        return "custom [min-max]";
    }
    
    /**
     * It returns a scale which can be used for choropleth color levels.
     * 
     * @param values 
     * @param size 
     */
    public getScale(values: number[], size: number): number[] {
        const scale: number[] = [];
        const step = (this.max - this.min) / size;
        scale.push(this.min-1);
        for (let i = 1; i < size; i++) {
            scale.push(step * i);
        }
        return scale;
    }
}
export default CustomMinMaxScale;