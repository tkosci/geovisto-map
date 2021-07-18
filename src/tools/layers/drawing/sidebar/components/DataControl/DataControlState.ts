import AbstractControlState from '../AbstractControl/AbstractControlState';
import DataControl from './DataControl';

class DataControlState extends AbstractControlState {
  constructor(props) {
    super(props);

    this.data = props.tabControl.getTool()?.getState()?.map?.state?.data;

    this.identifierType = '';

    this.filtersAmount = 0;
    this.filtersKeys = [];
    this.filtersValues = [];
  }

  /**
   * clears all filters for data mapping
   */
  clearFilters() {
    this.filtersAmount = 0;
    this.filtersKeys = [];
    this.filtersValues = [];
  }

  /**
   * gets filter key (column header)
   *
   * @param {Number} idx
   * @returns {String}
   */
  getFiltersKey(idx) {
    const key = this.filtersKeys[idx];
    return key;
  }

  /**
   * gets value in column
   *
   * @param {Number} idx
   * @returns {any} value in column
   */
  getFiltersValue(idx) {
    const value = this.filtersValues[idx];
    return value;
  }

  /**
   * sets value in filterKeys array
   *
   * @param {Number} idx
   * @param {any} value
   * @returns
   */
  setFiltersKey(idx, value) {
    if (idx > this.filtersAmount) return;
    this.filtersKeys[idx] = value;
  }

  /**
   * sets value in filterValues array
   *
   * @param {Number} idx
   * @param {any} value
   * @returns
   */
  setFiltersValue(idx, value) {
    if (idx > this.filtersAmount) return;
    this.filtersValues[idx] = value;
  }

  /**
   * runs whenever user clicks on 'Add Filter' button
   * essentially creates new filter
   */
  increaseFilters = () => {
    this.filtersAmount += 1;
    this.filtersKeys.push('');
    this.filtersValues.push('');
  };
  /**
   * runs whenever user clicks on 'Remove Filter' button
   * essentially removes last added filter and it's values
   */
  decreaseFilters = () => {
    if (this.filtersAmount === 0) return;
    this.filtersAmount -= 1;
    this.filtersKeys.pop();
    this.filtersValues.pop();
  };

  /**
   * returns "column header name"
   *
   * @returns {string}
   */
  getIdentifierType() {
    return this.identifierType;
  }

  /**
   * sets which column we should take identifier from
   *
   * @param {Object} e
   */
  changeWhichIdUseAction = (e) => {
    const id = e.target.value;
    const selectedEl = this._getSelected();

    this.identifierType = id;

    this._redrawSidebar(selectedEl?.layerType);
  };

  /**
   * called on field change
   *
   * @param {String} id
   * @returns
   */
  changeIdentifierAction = (id) => {
    if (!id) return;
    const selectedEl = this._getSelected();
    if (selectedEl) selectedEl.identifier = id;

    const data = this.tool.getState()?.map?.state?.data;

    // * create new variable and store imported data
    let filteredData = data;
    // * go through all appended filter keys
    this.filtersKeys.forEach((key, idx) => {
      // * loop through each row of imported data
      filteredData = filteredData.filter((d) => String(d[key]) === this.filtersValues[idx]);
    });

    const idType = this.identifierType;
    const found = filteredData.find((d) => String(d[idType]) === id);

    let popupText = '';
    if (found) {
      Object.keys(found).forEach((key) => {
        popupText += `${key}: ${found[key]}<br />`;
      });
    }

    this.changeDesc(popupText);
    this._redrawSidebar(selectedEl?.layerType);
  };

  /**
   * called on change of field
   *
   * @param {Object} e
   */
  changeDescriptionAction = (e) => {
    this.changeDesc(e.target.value);
  };

  /**
   * Takes selected element and bind new popup to it
   *
   * @param {String} inputText
   */
  changeDesc = (inputText) => {
    const selectedEl = this._getSelected();
    const modInputText = DataControl.convertDescToPopText(inputText);

    let popup1 = selectedEl.getPopup();
    if (popup1) {
      popup1.setContent(modInputText);
    } else {
      selectedEl.bindPopup(modInputText, { closeOnClick: false, autoClose: false });
    }
    // store for import
    if (selectedEl) selectedEl.popupContent = modInputText;
    if (selectedEl?.setStyle) selectedEl.setStyle(modInputText);
  };

  /**
   * forcefuly change identifier (not on field change)
   *
   * @param {Boolean} haveToCheckFilters
   * @returns
   */
  callIdentifierChange = (haveToCheckFilters = false) => {
    if (haveToCheckFilters && this.filtersAmount === 0) return;
    const selectedEl = this._getSelected();
    this.changeIdentifierAction(selectedEl?.identifier);
  };
}

export default DataControlState;
