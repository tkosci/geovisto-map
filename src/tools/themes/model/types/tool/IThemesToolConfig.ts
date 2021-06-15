import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";

/**
 * This type provides specification of the themes tool config model.
 * 
 * @author Jiri Hynek
 */
type IThemesToolConfig = IMapToolConfig & {
    theme?: string;
}
export default IThemesToolConfig;