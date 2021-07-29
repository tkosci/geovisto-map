// Geovisto core
import {
    IMapToolConfig
} from "../../../../../index.core";

/**
 * This type provides specification of the filters tool config model.
 * 
 * @author Jiri Hynek
 */
type IFiltersToolConfig = IMapToolConfig & {
    filterRules?: {
        domain: string,
        operation: string,
        pattern: string,
    }[];
}
export default IFiltersToolConfig;