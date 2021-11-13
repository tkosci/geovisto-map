import { IMapToolProps } from "../..";
import HierarchyTool from "./model/internal/HierarchyTool";
import HierarchyToolDefaults from "./model/internal/HierarchyToolDefaults";

export const GeovistoHierarchyTool: {
    getType: () => string,
    createTool: (props?: IMapToolProps) => HierarchyTool
} = {
    getType: () => HierarchyToolDefaults.TYPE,
    createTool: (props) => new HierarchyTool(props),
};