import { AbstractLayerToolSidebarTab, ILayerToolSidebarTab, ILayerToolSidebarTabProps, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";
import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import ConnectionLayerToolSidebarTabDefaults from "./ConnectionLayerToolSidebarTabDefaults";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";


/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolSidebarTab extends AbstractLayerToolSidebarTab<IConnectionLayerTool> implements ILayerToolSidebarTab {
    
    private htmlContent: HTMLDivElement | undefined;
    
    private inputs: {
        from: IMapFormInput,
        to: IMapFormInput,
    } | undefined;

    public constructor(tool: IConnectionLayerTool, props: ILayerToolSidebarTabProps) {
        super(tool, props);
    }

    /**
     * It creates new defaults of the tab control.
     */
    public createDefaults(): ILayerToolSidebarTabDefaults {
        return new ConnectionLayerToolSidebarTabDefaults();
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IConnectionLayerToolDimensions): void {
        // update inputs
        this.inputs?.from.setValue((dimensions.from.getDomain()?.getName())?? "");
        this.inputs?.to.setValue((dimensions.to.getDomain()?.getName())?? "");
    }

    /**
     * It returns the sidebar tab pane.
     */
    public getContent(): HTMLDivElement {
        if(this.htmlContent == undefined) {
            // tab content
            this.htmlContent = document.createElement('div');
            const elem = this.htmlContent.appendChild(document.createElement('div'));
    
            // get data mapping model
            const dimensions: IConnectionLayerToolDimensions = this.getTool().getState().getDimensions();

            // create inputs
            this.inputs = {
                from: this.getInputFrom(dimensions.from),
                to: this.getInputTo(dimensions.to)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.from.create());        
            elem.appendChild(this.inputs.to.create());
    
            // set input values
            this.setInputValues(dimensions);
        }
        
        return this.htmlContent;
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputFrom(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputTo(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }
}
export default ConnectionLayerToolSidebarTab;