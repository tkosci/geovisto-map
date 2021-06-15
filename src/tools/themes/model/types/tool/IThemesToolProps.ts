import { IMapToolProps } from "../../../../../model/types/tool/IMapToolProps";
import IMapThemesManager from "../theme/IMapThemesManager";
import IMapTheme from "../theme/IMapTheme";

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