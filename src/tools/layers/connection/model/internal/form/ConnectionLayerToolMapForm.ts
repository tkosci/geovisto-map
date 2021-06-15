import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";
import IConnectionLayerToolDimensions from "../../types/tool/IConnectionLayerToolDimensions";
import IMapDimension from "../../../../../../model/types/dimension/IMapDimension";
import IMapDataDomain from "../../../../../../model/types/data/IMapDataDomain";
import IGeoData from "../../../../../../model/types/geodata/IGeoData";
import MapLayerToolForm from "../../../../../../model/internal/form/MapLayerToolForm";
import IMapForm from "../../../../../../model/types/form/IMapForm";

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
        this.inputs?.geoData.setValue((dimensions.geoData.getDomain()?.getName())?? "");
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
            const dimensions: IConnectionLayerToolDimensions = this.getMapObject().getState().getDimensions();

            // create inputs
            this.inputs = {
                geoData: this.getInputGeoData(dimensions.geoData),
                from: this.getInputFrom(dimensions.from),
                to: this.getInputTo(dimensions.to)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geoData.create());
            elem.appendChild(this.inputs.from.create());        
            elem.appendChild(this.inputs.to.create());
    
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
export default ConnectionLayerToolMapForm;