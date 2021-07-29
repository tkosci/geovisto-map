// Geovisto core
import {
    IMapForm,
    IMapDataManager,
    FilterAutocompleteFormInput,
    LabeledAutocompleteFormInput,
    MapObjectForm,
    TabDOMUtil
} from "../../../../../index.core";

import IFiltersTool from "../../types/tool/IFiltersTool";
import IMapFilterManager from "../../types/filter/IMapFilterManager";
import IMapFilterRule from "../../types/filter/IMapFilterRule";

/**
 * This interface provides a help type which represents double (html element container, input).
 * 
 * @author Jiri Hynek
 */
interface InputItem {
    container: HTMLDivElement,
    input: FilterAutocompleteFormInput
}

/**
 * This class provides controls for management of filters map form inputs.
 * 
 * @author Jiri Hynek
 */
class FiltersToolMapForm extends MapObjectForm<IFiltersTool> implements IMapForm {
    
    /**
     * TODO: exclude class variables to the defaults and state.
     */
    private htmlContent!: HTMLDivElement;
    private btnGroup: HTMLDivElement | null;
    private inputs: InputItem[];

    /**
     * It creates new map form with respect to the given props.
     * 
     * @param tool 
     */
    public constructor(tool: IFiltersTool) {
        super(tool);

        this.btnGroup = null;
        this.inputs = [];
    }

    /**
     * A help function which returns data manager
     */
     protected getDataManager(): IMapDataManager | undefined {
        return this.getMapObject().getMap()?.getState().getMapData();
    }

    /**
     * A help function which returns data manager
     */
     protected getFilterManager(): IMapFilterManager {
        return this.getMapObject().getState().getFiltersManager();
    }

    /**
     * A help function which returns the element class.
     */
    protected getFilterRuleElementClass(objectType: string | undefined): string {
        if(objectType) {
            return objectType + "-filter";
        }
        return "unknown-object-filter";
    }

    /**
     * It returns a HTML div element conatining the form.
     */
    public getContent(): HTMLDivElement {
        //if(this.htmlContent == undefined) {
            // tab pane
            this.htmlContent = document.createElement('div');

            // btn group
            this.btnGroup = this.htmlContent.appendChild(document.createElement('div'));
            this.btnGroup.setAttribute("class", "filterButtons");

            // append add button
            this.btnGroup.appendChild(TabDOMUtil.createButton(
                "<i class=\"fa fa-plus-circle\"></i>",
                () => { this.addSelectItem(); }, "plusBtn"
            ));

            // append apply button
            this.btnGroup.appendChild(TabDOMUtil.createButton("Apply", () => {
                this.inputChangedAction();
            },"applyBtn"));

            // import inputs according to configuration
            this.setFilterRules(this.getMapObject().getState().getFilterRules());
        //}

        return this.htmlContent;
    }

    /**
     * Help static function which adds new select item to the filter map form. 
     */
    protected addSelectItem(): InputItem | null {
        // div container
        if(this.htmlContent) {
            const div: HTMLDivElement = this.htmlContent.insertBefore(document.createElement('div'), this.btnGroup);
            div.classList.add(this.getFilterRuleElementClass(this.getMapObject().getType()));
            
            const minusButton = TabDOMUtil.createButton(
                "<i class=\"fa fa-minus-circle\"></i>",
                (e: MouseEvent) => { this.removeSelectItem(e); }, "minusBtn");        
            div.appendChild(minusButton);

            /**
             * Help function which is invoked when the data domain input is changed.
             * It changes possible options of the operation and value inputs.
             * 
             * TODO: specify type of the param
             * 
             * @param e 
             */
            const updateValueOptions = (e: Event) => {
                // find the input item
                let input: FilterAutocompleteFormInput | null = null;
                const div: HTMLElement | null = (e.target as HTMLInputElement).closest("." + this.getFilterRuleElementClass(this.getMapObject().getType()));
                for(let i = 0; i < this.inputs.length; i++) {
                    if(this.inputs[i].container == div) {
                        input = this.inputs[i].input;
                        break;
                    }
                }

                if(input) {
                    const inputElement: { 
                        data: LabeledAutocompleteFormInput,
                        op: LabeledAutocompleteFormInput,
                        val: LabeledAutocompleteFormInput
                    } | null = input.getInputElement();

                    if(inputElement) {
                        // get selected value of the data domain input
                        const dataDomainName = (e.target as HTMLInputElement).value;
                        
                        // test if defined
                        if(dataDomainName != undefined && dataDomainName != "") {
                                // enable operation and value inputs
                                inputElement.op.setDisabled(false);
                                inputElement.val.setDisabled(false);
                                
                                // find possible values of selected data domain
                                const dataDomain = this.getDataManager()?.getDomain(dataDomainName);
                                if(dataDomain) {
                                    // update options of the value input
                                    // TODO specify the type
                                    inputElement.val.setOptions(this.getDataManager()?.getValues(dataDomain) as any[] ?? []);
                                }
                            
                        } else {
                            // disable operation and value inputs
                            inputElement.op.setDisabled(true);
                            inputElement.op.setValue("");
                            inputElement.val.setDisabled(true);
                            inputElement.val.setValue("");
                        }
                    }
                }
            };

            const dataManager = this.getDataManager();
            let dataDomainNames = dataManager?.getDomainNames();
            if(!dataDomainNames || dataDomainNames.length == 0) {
                dataDomainNames = [ "" ];
            }
            const dataDomain = dataManager?.getDomain(dataDomainNames[0]);
            const operationNames = this.getFilterManager().getDomainNames();

            // inputs
            const input = new FilterAutocompleteFormInput({
                data: {
                    options: dataDomainNames,
                    onChangeAction: updateValueOptions
                },
                ops: {
                    options: operationNames,
                    onChangeAction: function() { /* do nothing; TODO: update operators with respect to the data domain */ }
                },
                vals: {
                    // TODO: specify the type
                    options: dataDomain ? dataManager?.getValues(dataDomain) as any ?? [] : [],
                    onChangeAction: function() { /* do nothing */ }
                }
            });

            div.appendChild(input.create());

            // help input item
            const inputItem: InputItem = {
                container: div,
                input: input
            };

            // list of input items
            this.inputs.push(inputItem);

            return inputItem;
        }

        return null;
    }

    /**
     * Help function which removes item from the filter map form.
     */
     protected removeSelectItem(e: MouseEvent): void {
        if(e.target) {
            // get div
            const div = (<HTMLInputElement> e.target).closest("div");

            // find input item and remove it from DOM and list of input items
            for(let i = 0; i < this.inputs.length; i++) {
                if(this.inputs[i].container == div) {
                    div.remove();
                    this.inputs.splice(i, 1);
                    break;
                }
            }
        }
    }

    /**
     * It updates rules according to the input values.
     */
     protected inputChangedAction(): void {
        this.getMapObject().setFilterRules(this.getFilterRules());
    }

    /**
     * It updates input values according to the selection.
     */
     protected dimensionInputChangedAction(): void {
        // TODO
    }

    /**
     * It returns selected values from input fields and constructs filter rules.
     */
    protected getFilterRules(): IMapFilterRule[] {
        const filterRules = [];
        let value;
        let dataDomain;
        for(let i = 0; i < this.inputs.length; i++) {
            // get input value
            value = this.inputs[i].input.getValue();
            // get data domain
            dataDomain = this.getDataManager()?.getDomain(value.data);
            if(dataDomain) {
                // new filter rule
                const filterRule: IMapFilterRule | null = this.getFilterManager().createRule(dataDomain, value.op, value.val);
                if(filterRule) {
                    filterRules.push(filterRule);
                }
            }
        }
        return filterRules;
    }

    /**
     * It updates input fileds according to the given filter rules.
     * 
     * @param filterRules 
     */
     protected setFilterRules(filterRules: IMapFilterRule[]): void {
        // clear inputs
        for(let i = 0; i < this.inputs.length; i++) {
            this.inputs[i].container.remove();
        }
        this.inputs = [];

        if(filterRules == undefined || filterRules.length == 0) {
            // if filter rules are empty, initialize one empty input item
            this.addSelectItem();
        } else {
            // import inputs according to given filter rules
            for(let i = 0; i < filterRules.length; i++) {
                // create input for given filter rule
                this.addSelectItem()?.input.setValue({
                    data: filterRules[i].getDataDomain().getName().toString(),
                    op: filterRules[i].getFilterOperation().getName().toString(),
                    val: filterRules[i].getPattern()
                });
            }
        }
    }
}
export default FiltersToolMapForm;