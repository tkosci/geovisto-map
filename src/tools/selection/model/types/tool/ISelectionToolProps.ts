// Geovisto core
import {
    IMapToolProps
} from "../../../../../index.core";

import IMapSelection from "../selection/IMapSelection";

/**
 * This type provides the specification of the selection tool props model.
 * 
 * @author Jiri Hynek
 */
type ISelectionToolProps = IMapToolProps & {
    selection?: IMapSelection;
}
export default ISelectionToolProps;