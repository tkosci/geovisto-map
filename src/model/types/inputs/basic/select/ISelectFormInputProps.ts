import { SelectOpt } from "../../../../../tools/layers/drawing/util/constants";
import IMapFormInputProps from "../../IMapFormInputProps";

/**
 * This interface declares specification of the form input props model.
 *
 * @author Jiri Hynek
 */
interface ISelectFormInputProps extends IMapFormInputProps {
    onChangeAction: ((this: GlobalEventHandlers, ev: Event) => unknown) | null;
    options: string[] | SelectOpt[];
}
export default ISelectFormInputProps;