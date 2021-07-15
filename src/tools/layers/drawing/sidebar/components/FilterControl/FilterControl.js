import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';
import { createButton } from '../../../components/inputs';

class FilterControl {
  constructor(props) {
    this.tabControl = props.tabControl;
  }

  setDataKey = (e, index) => {
    let val = e.target.value;
    this.tabControl.getState().setFiltersKey(index, val);
    this.tabControl.redrawTabContent(this.tabControl._getSelected()?.layerType);
  };

  setDataValue = (e, index) => {
    let val = e.target.value;
    this.tabControl.getState().setFiltersValue(index, val);
    this.tabControl.getState().callIdentifierChange();
    this.tabControl.redrawTabContent(this.tabControl._getSelected()?.layerType);
  };

  /**
   * creates the filter fields
   *
   * @param {Object} elem
   * @param {Object} model
   */
  renderDataFilters = (elem, model) => {
    const data = this.tabControl.getTool()?.getState()?.map?.state?.data;

    const idOpts = data[0] ? Object.keys(data[0]).map((k) => ({ value: k, label: k })) : [];
    const state = this.tabControl.getState();

    for (let index = 0; index < state.filtersAmount; index++) {
      let filtersKey = state.getFiltersKey(index);
      let inputKey = SidebarInputFactory.createSidebarInput(model.dataFilterKey.input, {
        label: model.dataFilterKey.label,
        action: (e) => this.setDataKey(e, index),
        value: filtersKey,
        options: [{ value: '', label: '' }, ...idOpts],
      });
      let keyEl = inputKey.create();
      elem.appendChild(keyEl);
      // ***********************************************************
      let valueOpts = data && data[0][filtersKey] ? data.map((d) => d[filtersKey]) : [];
      valueOpts = Array.from(new Set(valueOpts));

      let inputValue = SidebarInputFactory.createSidebarInput(model.dataFilterValue.input, {
        label: model.dataFilterValue.label,
        action: (e) => this.setDataValue(e, index),
        value: state.getFiltersValue(index),
        options: ['', ...valueOpts],
      });
      let valueEl = inputValue.create();
      elem.appendChild(valueEl);

      elem.appendChild(document.createElement('hr'));
    }
  };

  addFilter = () => {
    this.tabControl.getState().increaseFilters();
    this.tabControl.redrawTabContent(this.tabControl._getSelected().layerType);
  };
  removeFilter = () => {
    this.tabControl.getState().decreaseFilters();
    this.tabControl.getState().callIdentifierChange();
    this.tabControl.redrawTabContent(this.tabControl._getSelected().layerType);
  };

  /**
   * creates the buttons for adding/removing buttons
   *
   * @param {Object} elem
   * @param {Object} model
   */
  renderFilterInputs = (elem, model) => {
    let disabled = !Boolean(this.tabControl._getSelected());

    const wrapper = document.createElement('div');
    wrapper.style.width = '100%';
    const addFilterBtn = createButton('Add Filter', this.addFilter, disabled);
    const removeFilterBtn = createButton('Remove Filter', this.removeFilter, disabled);
    wrapper.appendChild(addFilterBtn);
    wrapper.appendChild(removeFilterBtn);
    elem.appendChild(wrapper);
  };
}

export default FilterControl;
