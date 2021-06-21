import IMapFormInput from "../../types/inputs/IMapFormInput";
import IMapDimension from "../../types/dimension/IMapDimension";
import IMapDomain from "../../types/domain/IMapDomain";
import ILayerTool from "../../types/layer/ILayerTool";
import ILayerToolDimensions from "../../types/layer/ILayerToolDimensions";
import LabeledAutocompleteFormInput from "../inputs/labeled/autocomplete/LabeledAutocompleteFormInput";
import MapObjectForm from "./MapObjectForm";

/**
 * The interface declares functions for management of form inputs.
 * 
 * @author Jiri Hynek
 */
abstract class MapLayerToolForm<T extends ILayerTool> extends MapObjectForm<T> {

    public constructor(layerTool: T) {
        super(layerTool);
    }

    /**
     * It returns a HTML div element conatining the form.
     */
    public abstract getContent(): HTMLDivElement;

    /**
     * It updates selected input values according to the given dimensions.
     * 
     * @param dimensions 
     */
    public abstract setInputValues(dimensions: ILayerToolDimensions): void

    /**
     * Help method which returns a new universal autocomplete input for the any dimension.
     * 
     * @param dimension
     */
    protected getAutocompleteInput(dimension: IMapDimension<IMapDomain>): IMapFormInput {
        return new LabeledAutocompleteFormInput({
            label: dimension.getName(),
            options: dimension.getDomainManager().getDomainNames(),
            onChangeAction: (ev: Event) => {
                this.getMapObject().updateDimension(dimension, (<HTMLInputElement> ev.target).value, undefined);
            }
        });
    }
}
export default MapLayerToolForm;