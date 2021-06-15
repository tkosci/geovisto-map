import { IMapToolProps } from "../../../../../model/types/tool/IMapToolProps";
import IMapFiltersManager from "../filter/IMapFilterManager";
import IMapFilterRule from "../filter/IMapFilterRule";

/**
 * This type provides the specification of the filters tool props model.
 * 
 * @author Jiri Hynek
 */
type IFiltersToolProps = IMapToolProps & {
    manager?: IMapFiltersManager;
    rules?: IMapFilterRule[];
}
export default IFiltersToolProps;