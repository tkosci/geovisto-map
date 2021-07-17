import IMapAggregationBucket from "../../../types/aggregation/IMapAggregationBucket";
import IMapAggregationFunction from "../../../types/aggregation/IMapAggregationFunction";
import MapDomain from "../../domain/generic/MapDomain";

/**
 * This class provides the sum aggregation function.
 * 
 * @author Krystof Hynek
 */
class AverageAggregationFunction extends MapDomain implements IMapAggregationFunction {

    /**
     * It initializes the function.
     */
    public constructor() {
        super(AverageAggregationFunction.TYPE());
    }

    /**
     * Type of the function.
     */
    public static TYPE(): string {
        return "average";
    }
    
    /**
     * It returns a aggregation bucket for aggregation of multiple values.
     */
    public getAggregationBucket(): IMapAggregationBucket {
        return new class implements IMapAggregationBucket {
            
            private average = 0;
            private numberOfItems = 0;
            
            public addValue(value: number): void {
                this.numberOfItems += 1;
                this.average += (value - this.average) / this.numberOfItems;
            }
            
            public getValue(): number {
                return this.average;
            }
        }();
    }
}
export default AverageAggregationFunction;