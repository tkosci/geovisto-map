import IMapTool from "../../../model/types/tool/IMapTool";
import MapSelection from "./internal/selection/MapSelection";
import SelectionTool from "./internal/tool/SelectionTool";
import SelectionToolDefaults from "./internal/tool/SelectionToolDefaults";
import IMapSelection from "./types/selection/IMapSelection";
import ISelectionTool from "./types/tool/ISelectionTool";
import ISelectionToolProps from "./types/tool/ISelectionToolProps";

export const GeovistoSelectionTool: {
    getType: () => string,
    createTool: (props: ISelectionToolProps | undefined) => ISelectionTool
    createSelection: (source: IMapTool, ids: string[]) => IMapSelection
} = {
    getType: () => SelectionToolDefaults.TYPE,
    createTool: (props) => new SelectionTool(props),
    createSelection: (source, ids) => new MapSelection(source, ids)
};