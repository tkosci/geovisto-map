// Geovisto core
import {
    IMapToolConfig
} from "../../../../../index.core";

/**
 * This type provides specification of the selection tool config model.
 * 
 * @author Jiri Hynek
 */
type ISelectionToolConfig = IMapToolConfig & {
    selection?: { 
        tool: string;
        ids: string[];
    };
}
export default ISelectionToolConfig;