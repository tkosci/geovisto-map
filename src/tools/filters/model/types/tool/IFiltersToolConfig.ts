import IMapToolConfig from "../../../../../model/types/tool/IMapToolConfig";

/**
 * This type provides specification of the filters tool config model.
 * 
 * @author Jiri Hynek
 */
type IFiltersToolConfig = IMapToolConfig & {
    filterRules: {
        domain: string,
        operation: string,
        pattern: string,
    }[] | undefined;
}
export default IFiltersToolConfig;