// Geovisto core
import {
    AbstractMapDomain
} from "../../../../../../index.core";

import IMapFilterOperation from "../../../types/filter/IMapFilterOperation";

/**
 * This class wraps the equals greater than filter operation.
 *
 * @author Jiri Hynek
 */
class GtFilterOperation extends AbstractMapDomain implements IMapFilterOperation {

    public constructor() {
        super();
    }

    /**
     * It returns the string label of the filter representing operator.
     */
    public getName(): string {
        return ">";
    }

    /**
     * It checks if value equals pattern.
     *
     * @param value
     * @param pattern
     */
     public match(value: unknown, pattern: string): boolean {
        return new String(value).toString() > pattern;
    }
}
export default GtFilterOperation;
