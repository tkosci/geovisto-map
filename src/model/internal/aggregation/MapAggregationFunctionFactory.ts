import IMapAggregationFunction from "../../types/aggregation/IMapAggregationFunction";
import SumAggregationFunction from "./basic/SumAggregationFunction";
import CountAggregationFunction from "./basic/CountAggregationFunction";
import MapAggregationFunction from "./generic/MapAggregationFunction";
import IMapAggregationBucket from "../../types/aggregation/IMapAggregationBucket";
import IMapAggregationFunctionFactory from "../../types/aggregation/IMapAggregationFunctionFactory";

/**
 * This class provides a factory for aggregation functions.
 * 
 * @author Jiri Hynek
 */
class MapAggregationFunctionFactory implements IMapAggregationFunctionFactory {
    
    /**
     * It creates a generic aggregation function.
     */
    public default(type: string, aggregationBucket: () => IMapAggregationBucket): IMapAggregationFunction {
        return new MapAggregationFunction(type, aggregationBucket);
    }
    
    /**
     * It creates the count aggregation function.
     */
    public count(): IMapAggregationFunction {
        return new CountAggregationFunction();
    }
    
    /**
     * It creates the sum aggregation function.
     */
    public sum(): IMapAggregationFunction {
        return new SumAggregationFunction();
    }
}
export default MapAggregationFunctionFactory;