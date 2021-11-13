import { IMapToolConfig, IMapToolProps } from "../../../..";
import {
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    MapTool
} from "../../../../index.core";
import IHierarchyTool from "../types/IHierarchyTool";
import IHierarchyToolDefaults from "../types/IHierarchyToolDefaults";
import HierarchyToolMapForm from "../internal/forms/HieararchyToolMapForm";

import HierarchyToolDefaults from "./HierarchyToolDefaults";
import IHierarchyToolState from "../types/IHierarchyToolState";
import HierarchyToolState from "./HierarchyToolState";

class HierarchyTool extends MapTool implements IMapFormControl, IHierarchyTool {
    private mapForm!: IMapForm;

    public getMapForm(): IMapForm {
        if (this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }
    public constructor(props?: IMapToolProps) {
        super(props);
    }
    public getDefaults(): IHierarchyToolDefaults {
        return <IHierarchyToolDefaults>super.getDefaults();
    }

    public createDefaults(): IHierarchyToolDefaults {
        return new HierarchyToolDefaults();
    }

    protected createMapForm(): IMapForm {
        return new HierarchyToolMapForm(this);
    }

    public initialize(initProps: IMapToolInitProps<IMapToolConfig>): this {
        //initProps.map.getState().getLeafletMap(); // Event listener
        //initProps.map.getState().getEventManager().scheduleEvent()
        return super.initialize(initProps);
    }

    public getState(): IHierarchyToolState {
        return <IHierarchyToolState>super.getState();
    }

    public createState(): IHierarchyToolState {
        return new HierarchyToolState(this);
    }

    public setEnabled(enabled: boolean): void {
    }

    public copy(): IHierarchyTool {
        return new HierarchyTool(this.getProps());
    }

    public create(): this {
        return this;
    }


}

export default HierarchyTool;