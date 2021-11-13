import IHierarchyToolManager from "../types/IHierarchyToolManager";
import HierarchyParent from "./HierarchyParent";

class HierarchyToolManager implements IHierarchyToolManager {

    private parents : HierarchyParent[];

    public constructor() {
        this.parents =[];
    }

    logOnConsole() :void {
        console.log("MANAGER LOG!");
        console.log(this.parents);
    }

    addParent(id:string, zoomLevel:number, childs:string[]):void {
        this.parents.push(new HierarchyParent(id, zoomLevel, childs));
    }


}

export default HierarchyToolManager;