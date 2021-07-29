// Geovisto core
import {
    IGeoData,
    IMapDataDomain,
    IMapDomainDimension,
    IMapForm,
    IMapFormInput,
    IMapTypeDimension,
    MapLayerToolForm
} from "../../../../../../index.core";

import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ConnectionLayerToolMapForm extends MapLayerToolForm<IConnectionLayerTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;
    
    private inputs?: {
        geoData: IMapFormInput,
        from: IMapFormInput,
        to: IMapFormInput,
        direction: IMapFormInput,
    };

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IConnectionLayerTool) {
        super(tool);
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IConnectionLayerToolDimensions): void {
        // update inputs
        this.inputs?.geoData.setValue((dimensions.geoData.getValue()?.getName()) ?? "");
        this.inputs?.from.setValue((dimensions.from.getValue()?.getName()) ?? "");
        this.inputs?.to.setValue((dimensions.to.getValue()?.getName()) ?? "");
        this.inputs?.direction.setValue((dimensions.direction.getValue()) ?? "");
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
            const dimensions: IConnectionLayerToolDimensions = this.getMapObject().getState().getDimensions();

            // create inputs
            this.inputs = {
                geoData: this.getInputGeoData(dimensions.geoData),
                from: this.getInputFrom(dimensions.from),
                to: this.getInputTo(dimensions.to),
                direction: this.getInputDirection(dimensions.direction)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geoData.create());
            elem.appendChild(this.inputs.from.create());        
            elem.appendChild(this.inputs.to.create());
            elem.appendChild(this.inputs.direction.create());
    
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
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputFrom(dimension: IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputTo(dimension: IMapDomainDimension<IMapDataDomain>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the geo dimension.
     * 
     * @param dimension
     */
    public getInputDirection(dimension: IMapTypeDimension<boolean>): IMapFormInput {
        return this.getCheckboxInput(dimension);
    }
}
export default ConnectionLayerToolMapForm;