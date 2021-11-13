import {
    IMapForm,
    MapObjectForm,
} from "../../../../../index.core";
import IHierarchyTool from "../../types/IHierarchyTool";

class HierarchyToolMapForm extends MapObjectForm<IHierarchyTool> implements IMapForm {
    private htmlContent!: HTMLDivElement;

    public constructor(tool: IHierarchyTool) {
        super(tool);
    }

    public getContent(): HTMLDivElement {
        this.htmlContent = document.createElement('div');
        return this.htmlContent;

    }
}
export default HierarchyToolMapForm;