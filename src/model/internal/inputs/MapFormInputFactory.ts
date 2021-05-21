import IMapFormInput from "../../types/inputs/IMapFormInput";
import TextFormInput from "./basic/text/TextFormInput";
import ITextFormInputProps from "../../types/inputs/basic/text/ITextFormInputProps";
import ISelectFormInputProps from "../../types/inputs/basic/select/ISelectFormInputProps";
import ILabeledMapFormInputProps from "../../types/inputs/labeled/text/ILabeledTextFormInputProps";
import SelectFormInput from "./basic/select/SelectFormInput";
import ILabeledSelectFormInputProps from "../../types/inputs/labeled/select/ILabeledSelectFormInputProps";
import ILabeledAutocompleteFormInputProps from "../../types/inputs/labeled/autocomplete/ILabeledAutocompleteFormInputProps";
import IFilterFormInputProps from "../../types/inputs/filter/IFilterFormInputProps";
import FilterSelectFormInput from "./filter/select/FilterSelectFormInput";
import LabeledAutocompleteFormInput from "./labeled/autocomplete/LabeledAutocompleteFormInput";
import FilterAutocompleteFormInput from "./filter/autocomplete/FilterAutocompleteFormInput";

/**
 * This class provides a factory for form inputs.
 * 
 * @author Jiri Hynek
 */
class MapFormInputFactory {
    
    /**
     * It creates the text form input.
     */
    public text(props: ITextFormInputProps): IMapFormInput {
        return new TextFormInput(props);
    }
    
    /**
     * It creates the select form input.
     */
    public select(props: ISelectFormInputProps): IMapFormInput {
        return new SelectFormInput(props);
    }
    
    /**
     * It creates the labeled text form input.
     */
    public labeledText(props: ILabeledMapFormInputProps): IMapFormInput {
        return new TextFormInput(props);
    }
    
    /**
     * It creates the labeled select form input.
     */
    public labeledSelect(props: ILabeledSelectFormInputProps): IMapFormInput {
        return new SelectFormInput(props);
    }
    
    /**
     * It creates the labeled autocomplete form input.
     */
    public labeledAutocomplete(props: ILabeledAutocompleteFormInputProps): IMapFormInput {
        return new LabeledAutocompleteFormInput(props);
    }
    
    /**
     * It creates the filter select form input.
     */
    public filterSelect(props: IFilterFormInputProps): IMapFormInput {
        return new FilterSelectFormInput(props);
    }
    
    /**
     * It creates the filter autocomplete form input.
     */
    public filterAutocomplete(props: IFilterFormInputProps): IMapFormInput {
        return new FilterAutocompleteFormInput(props);
    }
}
export default MapFormInputFactory;