import ChoroplethLayerToolSidebarTabDefaults from "./ChoroplethLayerToolSidebarTabDefaults";
import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import { ILayerToolSidebarTabProps, AbstractLayerToolSidebarTab, ILayerToolSidebarTab, ILayerToolSidebarTabDefaults } from "../../../../../sidebar";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IMapAggregationFunction from "../../../../../../model/types/aggregation/IMapAggregationFunction";
import IGeoData from "../../../../../../model/types/geodata/IGeoData";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ChoropolethLayerToolSidebarTab extends AbstractLayerToolSidebarTab<IChoroplethLayerTool> implements ILayerToolSidebarTab {
    
    private htmlContent: HTMLDivElement | undefined;
    
    private inputs: {
        geoData: IMapFormInput,
        geoId: IMapFormInput,
        value: IMapFormInput,
        aggregation: IMapFormInput
    } | undefined;

    public constructor(props: ILayerToolSidebarTabProps) {
        super(props);
    }

    /**
     * It creates new defaults of the tab control.
     */
    public createDefaults(): ILayerToolSidebarTabDefaults {
        return new ChoroplethLayerToolSidebarTabDefaults();
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IChoroplethLayerToolDimensions): void {
        // update inputs
        this.inputs?.geoData.setValue((dimensions.geoData.getDomain()?.getName())?? "");
        this.inputs?.geoId.setValue((dimensions.geoId.getDomain()?.getName())?? "");
        this.inputs?.value.setValue((dimensions.value.getDomain()?.getName())?? "");
        this.inputs?.aggregation.setValue((dimensions.aggregation.getDomain()?.getName())?? "");
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
            const dimensions: IChoroplethLayerToolDimensions = this.getTool().getState().getDimensions();

            // create inputs
            this.inputs = {
                geoData: this.getInputGeoData(dimensions.geoData),
                geoId: this.getInputGeoId(dimensions.geoId),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geoData.create());
            elem.appendChild(this.inputs.geoId.create());
            elem.appendChild(this.inputs.value.create());
            elem.appendChild(this.inputs.aggregation.create());
    
            // set input values
            this.setInputValues(dimensions);
        }
        
        return this.htmlContent;
    }

    /**
     * It returns new input for the geo data dimension.
     * 
     * @param dimension
     */
    public getInputGeoData(dimension: IMapDimension<IGeoData>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo id dimension.
     * 
     * @param dimension
     */
    public getInputGeoId(dimension: IMapDimension<IMapDataDomain>): IMapFormInput {
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
}
export default ChoropolethLayerToolSidebarTab;