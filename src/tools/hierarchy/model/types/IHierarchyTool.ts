import { IMapTool } from "../../../..";

interface IHierarchyTool extends IMapTool {
    copy() : IHierarchyTool;
}
export default IHierarchyTool;