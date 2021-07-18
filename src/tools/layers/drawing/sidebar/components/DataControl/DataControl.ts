import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';
import { createButton } from '../../../util/inputs';
import AbstractControl from '../AbstractControl/AbstractControl';
import DataControlState from './DataControlState';

class DataControl extends AbstractControl {
  constructor(props) {
    super(props);

    this.state = new DataControlState({ tabControl: props.tabControl, control: this });
  }

  // ************************* Data Inputs ***************************************

  /**
   * creates a field for picking column name where to choose identifier from
   *
   * @returns {Object} HTML element
   */
  createPickIdentifier = (model) => {
    const { data } = this.state;

    const idOpts = data[0] ? Object.keys(data[0]).map((k) => ({ value: k, label: k })) : [];

    const result = SidebarInputFactory.createSidebarInput(model.idKey.input, {
      label: model.idKey.label,
      action: this.state.changeWhichIdUseAction,
      value: this.state.getIdentifierType(),
      options: [{ value: '', label: '' }, ...idOpts],
    });

    return result;
  };

  /**
   * creates a field for identier input
   *
   * @returns {Object} HTML element
   */
  createIdentifierInput = (model) => {
    const { data } = this.state;

    const idKey = this.state.getIdentifierType();

    let idOpts = data && data[0][idKey] ? data.map((d) => d[idKey]) : [];
    idOpts = Array.from(new Set(idOpts));

    const result = SidebarInputFactory.createSidebarInput(model.identifier.input, {
      label: model.identifier.label,
      action: (e) => this.state.changeIdentifierAction(e.target.value),
      value: this.state._getSelected()?.identifier || '',
      options: idOpts,
      placeholder: 'e.g. CZ',
    });

    return result;
  };

  renderDataInputs = (elem, model) => {
    let disableTextFields = !Boolean(this.state._getSelected());
    // Select Pick Identifier
    const inputPickIdentifier = this.createPickIdentifier(model);
    elem.appendChild(inputPickIdentifier.create());
    inputPickIdentifier.setDisabled(disableTextFields);
    // textfield Identifier
    const inputId = this.createIdentifierInput(model);
    elem.appendChild(inputId.create());
    inputId.setDisabled(disableTextFields);
    // textarea Description
    const inputDesc = SidebarInputFactory.createSidebarInput(model.description.input, {
      label: model.description.label,
      action: this.state.changeDescriptionAction,
      value: DataControl.convertDescfromPopText(
        this.state._getSelected()?.getPopup()?.getContent(),
      ),
    });
    elem.appendChild(inputDesc.create());
    inputDesc.setDisabled(disableTextFields);
  };

  // ************************* Data Inputs END ***************************************

  /**
   * for linebreak in poup text we use '<br>' tag
   */
  static convertDescToPopText = (descText: string) => {
    if (!descText) return '';
    return descText.replaceAll('\n', '<br />');
  };

  /**
   * for linebreak in field we use '\n' character
   */
  static convertDescfromPopText = (popText: string) => {
    if (!popText) return '';
    return popText.replaceAll('<br />', '\n');
  };

  // ************************* Filter Inputs ***************************************

  setDataKey = (e, index) => {
    let val = e.target.value;
    this.state.setFiltersKey(index, val);
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  setDataValue = (e, index) => {
    let val = e.target.value;
    this.state.setFiltersValue(index, val);
    this.state.callIdentifierChange();
    this.state._redrawSidebar(this.state._getSelected()?.layerType);
  };

  /**
   * creates the filter fields
   *
   * @param {Object} elem
   * @param {Object} model
   */
  renderDataFilters = (elem, model) => {
    const { data } = this.state;

    const idOpts = data[0] ? Object.keys(data[0]).map((k) => ({ value: k, label: k })) : [];

    for (let index = 0; index < this.state.filtersAmount; index++) {
      let filtersKey = this.state.getFiltersKey(index);
      // * input for key
      let inputKey = SidebarInputFactory.createSidebarInput(model.dataFilterKey.input, {
        label: model.dataFilterKey.label,
        action: (e) => this.setDataKey(e, index),
        value: filtersKey,
        options: [{ value: '', label: '' }, ...idOpts],
      });

      // ***********************************************************
      let valueOpts = data && data[0][filtersKey] ? data.map((d) => d[filtersKey]) : [];
      valueOpts = Array.from(new Set(valueOpts));
      // * input for value
      let inputValue = SidebarInputFactory.createSidebarInput(model.dataFilterValue.input, {
        label: model.dataFilterValue.label,
        action: (e) => this.setDataValue(e, index),
        value: this.state.getFiltersValue(index),
        options: ['', ...valueOpts],
      });

      // * append elements
      elem.appendChild(document.createElement('hr'));
      elem.appendChild(inputKey.create());
      elem.appendChild(inputValue.create());
    }
  };

  addFilter = () => {
    this.state.increaseFilters();
    this.state._redrawSidebar(this.state._getSelected().layerType);
  };

  removeFilter = () => {
    this.state.decreaseFilters();
    this.state.callIdentifierChange();
    this.state._redrawSidebar(this.state._getSelected().layerType);
  };

  /**
   * creates the buttons for adding/removing buttons
   *
   * @param {Object} elem
   * @param {Object} model
   */
  renderFilterInputs = (elem, model) => {
    let disabled = !Boolean(this.state._getSelected());

    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    const addFilterBtn = createButton('Add Filter', this.addFilter, disabled);
    const removeFilterBtn = createButton('Remove Filter', this.removeFilter, disabled);
    wrapper.appendChild(addFilterBtn);
    wrapper.appendChild(removeFilterBtn);
    elem.appendChild(wrapper);
  };

  // ************************* Filter Inputs END ***************************************
}

export default DataControl;
