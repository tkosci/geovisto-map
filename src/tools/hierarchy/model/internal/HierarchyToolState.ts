import {
    IMapDataDomain,
    IMapToolInitProps,
    MapToolState
} from "../../../../index.core";
import IHierarchyTool from "../types/IHierarchyTool";
import IHierarchyToolDefaults from "../types/IHierarchyToolDefaults";
import IHierarchyToolState from "../types/IHierarchyToolState";
import IHierarchyToolProps from "../types/IHierarchyToolProps";
import IHierarchyToolConfig from "../types/IHierarchyToolConfig";
import IHierarchyToolManager from "../types/IHierarchyToolManager";
import HierarchyToolManager from "./HierarchyToolManager";

class HierarchyToolState extends MapToolState implements IHierarchyToolState {
    private manager!: IHierarchyToolManager;

    public constructor(tool: IHierarchyTool) {
        super(tool);
        this.manager = new HierarchyToolManager;
    } 

    public initialize(defaults: IHierarchyToolDefaults, props: IHierarchyToolProps, initProps: IMapToolInitProps<IHierarchyToolProps>): void {
        super.initialize(defaults, props, initProps);
    }

    public deserialize(config: IHierarchyToolConfig): void {
        super.deserialize(config);

        if(config.HierarchyConf) {
            console.log("### Config found.");
            for (let i = 0; i < config.HierarchyConf.length; i++) {
                let id : string = config.HierarchyConf[i].id;
                let zoomLevel: number = config.HierarchyConf[i].zoomLevel;
                let childs: string[] = config.HierarchyConf[i].childs;
                this.manager.addParent(id, zoomLevel, childs);
            }

            this.manager.logOnConsole();
        }
    }
}

export default HierarchyToolState;