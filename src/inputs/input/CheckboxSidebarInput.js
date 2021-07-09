import AbstractSidebarInput from '../AbstractSidebarInput';

const ID = 'geovisto-input-checkbox';

/**
 * This class represents basic checkbox sidebar input.
 *
 * @author Krystof Rykala
 */
class CheckboxSidebarInput extends AbstractSidebarInput {
    constructor(settings) {
        super(settings);
        this.label = settings.label;
        this.elementWrapper = undefined;
    }

    /**
     * Static function returns identifier of the input type.
     */
    static ID() {
        return ID;
    }

    /**
     * It returns input element.
     */
    create() {
        this.elementWrapper = document.createElement('div');
        this.elementWrapper.setAttribute('class', ID);

        const labelElement = this.createLabel();
        this.input = this.createCheckbox();

        this.elementWrapper.appendChild(labelElement);
        this.elementWrapper.appendChild(this.input);

        return this.elementWrapper;
    }

    /**
     * A help method which creates the label HTML element.
     */
    createLabel() {
        const labelElement = document.createElement('div');
        labelElement.innerHTML = this.label;
        labelElement.setAttribute("class", `${ID}-label`);
        return labelElement;
    }

    /**
     * A help method which creates the checkbox HTML element.
     */
    createCheckbox() {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.onchange = this.action;
        input.name = this.name;
        return input;
    }

    /**
     * It returns the value of the input element.
     */
    getValue() {
        return this.input.checked;
    }

    /**
     * It sets value of the input element.
     * 
     * @param {*} checked 
     */
    setValue(checked) {
        this.input.checked = checked;
    }
}

export default CheckboxSidebarInput;
