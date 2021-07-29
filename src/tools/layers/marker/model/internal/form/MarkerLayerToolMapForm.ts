// Geovisto core
import {
    IGeoData,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapForm,
    IMapFormInput,
    MapLayerToolForm
} from "../../../../../../index.core";

import IMarkerLayerTool from "../../types/tool/IMarkerLayerTool";
import IMarkerLayerToolDimensions from "../../types/tool/IMarkerLayerToolDimensions";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerToolMapForm extends MapLayerToolForm<IMarkerLayerTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;
    
    private inputs?: {
        geoData: IMapFormInput,
        geoId: IMapFormInput,
        value: IMapFormInput,
        aggregation: IMapFormInput,
        category: IMapFormInput
    };

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IMarkerLayerTool) {
        super(tool);
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IMarkerLayerToolDimensions): void {
        // update inputs
        this.inputs?.geoData.setValue((dimensions.geoData.getValue()?.getName())?? "");
        this.inputs?.geoId.setValue((dimensions.geoId.getValue()?.getName())?? "");
        this.inputs?.value.setValue((dimensions.value.getValue()?.getName())?? "");
        this.inputs?.aggregation.setValue((dimensions.aggregation.getValue()?.getName())?? "");
        this.inputs?.category.setValue((dimensions.category.getValue()?.getName())?? "");
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
            const dimensions: IMarkerLayerToolDimensions = this.getMapObject().getState().getDimensions();

            // create inputs
            this.inputs = {
                geoData: this.getInputGeoData(dimensions.geoData),
                geoId: this.getInputGeoId(dimensions.geoId),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation),
                category: this.getInputCategory(dimensions.category)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geoData.create());  
            elem.appendChild(this.inputs.geoId.create());        
            elem.appendChild(this.inputs.value.create());            
            elem.appendChild(this.inputs.aggregation.create());
            elem.appendChild(this.inputs.category.create());
    
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
    public getInputGeoData(dimension: IMapDomainDimension<IGeoData>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo id dimension.
     * 
     * @param dimension
     */
    public getInputGeoId(dimension: IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputValue(dimension: IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputAggregation(dimension: IMapDomainDimension<IMapAggregationFunction>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputCategory(dimension: IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

}
export default MarkerLayerToolMapForm;