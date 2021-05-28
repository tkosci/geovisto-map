import { AbstractLayerToolSidebarTab, ILayerToolSidebarTab, ILayerToolSidebarTabProps, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";
import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import MarkerLayerToolSidebarTabDefaults from "./MarkerLayerToolSidebarTabDefaults";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolSidebarTab extends AbstractLayerToolSidebarTab<IMarkerLayerTool> implements ILayerToolSidebarTab {
    
    private htmlContent: HTMLDivElement | undefined;
    
    private inputs: {
        geo: IMapFormInput,
        value: IMapFormInput,
        aggregation: IMapFormInput,
        category: IMapFormInput
    } | undefined;

    public constructor(props: ILayerToolSidebarTabProps) {
        super(props);
    }

    /**
     * It creates new defaults of the tab control.
     */
    public createDefaults(): ILayerToolSidebarTabDefaults {
        return new MarkerLayerToolSidebarTabDefaults();
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IMarkerLayerToolDimensions): void {
        // update inputs
        this.inputs?.geo.setValue((dimensions.geo.getDomain()?.getName())?? "");
        this.inputs?.value.setValue((dimensions.value.getDomain()?.getName())?? "");
        this.inputs?.aggregation.setValue((dimensions.aggregation.getDomain()?.getName())?? "");
        this.inputs?.category.setValue((dimensions.category.getDomain()?.getName())?? "");
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
            const dimensions: IMarkerLayerToolDimensions = this.getTool().getState().getDimensions();

            // create inputs
            this.inputs = {
                geo: this.getInputGeo(dimensions.geo),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation),
                category: this.getInputCategory(dimensions.category)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geo.create());        
            elem.appendChild(this.inputs.value.create());            
            elem.appendChild(this.inputs.aggregation.create());
            elem.appendChild(this.inputs.category.create());
    
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
    public getInputGeo(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputValue(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputAggregation(dimension: IMapDimension<IMapAggregationFunction>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputCategory(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

}
export default MarkerLayerToolSidebarTab;