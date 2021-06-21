import ISelectionTool from "./model/types/tool/ISelectionTool";
import { ISelectionToolAPI } from "./model/types/tool/ISelectionToolAPI";
import ISelectionToolProps from "./model/types/tool/ISelectionToolProps";
import SelectionTool from "./model/internal/tool/SelectionTool";
import SelectionToolAPI from "./model/internal/tool/SelectionToolAPI";

/**
 * Factory for Selection Tool.
 * 
 * @author Jiri Hynek
 */
const GeovistoSelectionTool: ISelectionToolAPI & {
    createTool: (props?: ISelectionToolProps) => ISelectionTool
} = { ...SelectionToolAPI, 
    createTool: (props?: ISelectionToolProps) => new SelectionTool(props)
};
export default GeovistoSelectionTool;