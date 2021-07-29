// Geovisto core
import {
    IMapToolConfig
} from "../../../../../index.core";

/**
 * This type provides specification of the themes tool config model.
 * 
 * @author Jiri Hynek
 */
type IThemesToolConfig = IMapToolConfig & {
    theme?: string;
}
export default IThemesToolConfig;