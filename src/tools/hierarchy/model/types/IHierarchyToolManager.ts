interface IHierarchyToolManager {

    logOnConsole() : void;

    addParent(id:string, zoomLevel:number, childs:string[]) : void;
}
export default IHierarchyToolManager;