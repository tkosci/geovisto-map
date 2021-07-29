// Geovisto core
import {
    IGeoData,
    IIntegerRangeManager,
    IMapAggregationFunction,
    IMapDataDomain,
    IMapDomainDimension,
    IMapForm,
    IMapFormInput,
    IMapTypeDimension,
    MapLayerToolForm
} from "../../../../../../index.core";

import IChoroplethLayerTool from "../../types/tool/IChoroplethLayerTool";
import IChoroplethLayerToolDimensions from "../../types/tool/IChoroplethLayerToolDimensions";
import IScale from "../../types/scale/IScale";

/**
 * This class provides controls for management of the layer sidebar tab.
 * 
 * @author Jiri Hynek
 */
class ChoropolethLayerToolMapForm extends MapLayerToolForm<IChoroplethLayerTool> implements IMapForm {
    
    private htmlContent!: HTMLDivElement;
    
    private inputs?: {
        geoData: IMapFormInput,
        geoId: IMapFormInput,
        value: IMapFormInput,
        aggregation: IMapFormInput,
        customColor: IMapFormInput,
        color: IMapFormInput,
        range: IMapFormInput,
        scaling: IMapFormInput,
        customMinMax: IMapFormInput,
        minValue: IMapFormInput,
        maxValue: IMapFormInput
    };

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IChoroplethLayerTool) {
        super(tool);
    }

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public setInputValues(dimensions: IChoroplethLayerToolDimensions): void {
        // update inputs
        this.inputs?.geoData.setValue((dimensions.geoData.getValue()?.getName()) ?? "");
        this.inputs?.geoId.setValue((dimensions.geoId.getValue()?.getName()) ?? "");
        this.inputs?.value.setValue((dimensions.value.getValue()?.getName()) ?? "");
        this.inputs?.aggregation.setValue((dimensions.aggregation.getValue()?.getName()) ?? "");
        this.inputs?.customColor.setValue((dimensions.customColor.getValue()) ?? "");
        this.inputs?.color.setValue((dimensions.color.getValue()) ?? "");
        this.inputs?.range.setValue((dimensions.range.getValue()) ?? "");
        this.inputs?.scaling.setValue((dimensions.scaling.getValue()?.getName()) ?? "");
        this.inputs?.customMinMax.setValue((dimensions.customMinMax.getValue()) ?? "");
        this.inputs?.minValue.setValue((dimensions.minValue.getValue()) ?? "");
        this.inputs?.maxValue.setValue((dimensions.maxValue.getValue()) ?? "");

        // update disabled attribute
        this.inputs?.color.setDisabled(!dimensions.customColor.getValue());
        this.inputs?.scaling.setDisabled(dimensions.customMinMax.getValue() ?? false);
        this.inputs?.minValue.setDisabled(!dimensions.customMinMax.getValue());
        this.inputs?.maxValue.setDisabled(!dimensions.customMinMax.getValue());
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
            const dimensions: IChoroplethLayerToolDimensions = this.getMapObject().getState().getDimensions();

            // create inputs
            this.inputs = {
                geoData: this.getInputGeoData(dimensions.geoData),
                geoId: this.getInputGeoId(dimensions.geoId),
                value: this.getInputValue(dimensions.value),
                aggregation: this.getInputAggregation(dimensions.aggregation),
                customColor: this.getInputCustomColor(dimensions.customColor),
                color: this.getInputColor(dimensions.color),
                range: this.getInputRange(dimensions.range),
                scaling: this.getInputScaling(dimensions.scaling),
                customMinMax: this.getInputCustomMinMax(dimensions.customMinMax),
                minValue: this.getInputMinValue(dimensions.minValue),
                maxValue: this.getInputMaxValue(dimensions.maxValue)
            };
            
            // append to DOM
            elem.appendChild(this.inputs.geoData.create());
            elem.appendChild(this.inputs.geoId.create());
            elem.appendChild(this.inputs.value.create());
            elem.appendChild(this.inputs.aggregation.create());
            elem.appendChild(this.inputs.customColor.create());
            elem.appendChild(this.inputs.color.create());
            elem.appendChild(this.inputs.range.create());
            elem.appendChild(this.inputs.scaling.create());
            elem.appendChild(this.inputs.customMinMax.create());
            elem.appendChild(this.inputs.minValue.create());
            elem.appendChild(this.inputs.maxValue.create());
    
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
     * It returns new input for the custom color dimension.
     * 
     * @param dimension
     */
    public getInputCustomColor(dimension: IMapTypeDimension<boolean>): IMapFormInput {
        return this.getCheckboxInput(dimension, (ev: Event) => {
            this.inputs?.color.setDisabled(!(<HTMLInputElement> ev.target).checked);
        });
    }

    /**
     * It returns new input for the color dimension.
     * 
     * @param dimension
     */
    public getInputColor(dimension: IMapTypeDimension<string>): IMapFormInput {
        return this.getColorInput(dimension);
    }

    /**
     * It returns new input for the range dimension.
     * 
     * @param dimension
     */
    public getInputRange(dimension: IMapTypeDimension<number, IIntegerRangeManager>): IMapFormInput {
        return this.getSliderInput(dimension);
    }

    /**
     * It returns new input for the scaling dimension.
     * 
     * @param dimension
     */
    public getInputScaling(dimension: IMapDomainDimension<IScale>): IMapFormInput {
        return this.getAutocompleteInput(dimension);
    }

    /**
     * It returns new input for the custom min-max dimension.
     * 
     * @param dimension
     */
    public getInputCustomMinMax(dimension: IMapTypeDimension<boolean>): IMapFormInput {
        return this.getCheckboxInput(dimension, (ev: Event) => {
            this.inputs?.scaling.setDisabled((<HTMLInputElement> ev.target).checked);
            this.inputs?.minValue.setDisabled(!(<HTMLInputElement> ev.target).checked);
            this.inputs?.maxValue.setDisabled(!(<HTMLInputElement> ev.target).checked);
        });
    }

    /**
     * It returns new input for the min value dimension.
     * 
     * @param dimension
     */
    public getInputMinValue(dimension: IMapTypeDimension<number>): IMapFormInput {
        return this.getNumberInput(dimension);
    }

    /**
     * It returns new input for the max value dimension.
     * 
     * @param dimension
     */
    public getInputMaxValue(dimension: IMapTypeDimension<number>): IMapFormInput {
        return this.getNumberInput(dimension);
    }
}
export default ChoropolethLayerToolMapForm;