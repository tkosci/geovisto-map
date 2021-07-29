// Geovisto core
import {
    IMapToolProps
} from "../../../../../index.core";

import IMapTheme from "../theme/IMapTheme";
import IMapThemesManager from "../theme/IMapThemesManager";

/**
 * This type provides the specification of the themes tool props model.
 * 
 * @author Jiri Hynek
 */
type IThemesToolProps = IMapToolProps & {
    manager?: IMapThemesManager;
    theme?: IMapTheme;
}
export default IThemesToolProps;