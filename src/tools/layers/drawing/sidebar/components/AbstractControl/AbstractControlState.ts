/**
 * Abstract class for control state.
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for data and logic of inputs, not rendering
 */
class AbstractControlState {
  constructor(props: { tabControl: object, control: object }) {
    this.tabControl = props.tabControl;
    this.tool = props.tabControl.getTool();
    this.control = props.control;
  }

  _getSelected = () => {
    return this.tool.getState().selectedLayer;
  };

  _getExtraSelected = () => {
    return this.tool.getState().extraSelected;
  };

  _redrawSidebar = (type?: string) => {
    return this.tabControl.redrawTabContent(type);
  };
}

export default AbstractControlState;
