import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';

class DataControl {
  constructor(props) {
    this.tabControl = props.tabControl;
  }

  /**
   * creates a field for picking column name where to choose identifier from
   *
   * @returns {Object} HTML element
   */
  createPickIdentifier = (model) => {
    const data = this.tabControl.getTool()?.getState()?.map?.state?.data;

    const idOpts = data[0] ? Object.keys(data[0]).map((k) => ({ value: k, label: k })) : [];

    const result = SidebarInputFactory.createSidebarInput(model.idKey.input, {
      label: model.idKey.label,
      action: this.tabControl.getState().changeWhichIdUseAction,
      value: this.tabControl.getState().getIdentifierType(),
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
    const data = this.tabControl.getTool()?.getState()?.map?.state?.data;

    const idKey = this.tabControl.getState().getIdentifierType();

    let idOpts = data && data[0][idKey] ? data.map((d) => d[idKey]) : [];
    idOpts = Array.from(new Set(idOpts));

    const result = SidebarInputFactory.createSidebarInput(model.identifier.input, {
      label: model.identifier.label,
      action: (e) => this.tabControl.getState().changeIdentifierAction(e.target.value),
      value: this.tabControl._getSelected()?.identifier || '',
      options: idOpts,
      placeholder: 'e.g. CZ',
    });

    return result;
  };

  renderDataInputs = (elem, model) => {
    let disableTextFields = !Boolean(this.tabControl._getSelected());
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
      action: this.tabControl.getState().changeDescriptionAction,
      value: DataControl.convertDescfromPopText(
        this.tabControl._getSelected()?.getPopup()?.getContent(),
      ),
    });
    elem.appendChild(inputDesc.create());
    inputDesc.setDisabled(disableTextFields);
  };

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
}

export default DataControl;
