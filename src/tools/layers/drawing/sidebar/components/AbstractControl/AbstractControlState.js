class AbstractControlState {
  constructor(props) {
    this.tabControl = props.tabControl;
    this.tool = props.tabControl.getTool();
    this.control = props.control;
  }

  _getSelected = () => {
    return this.tool.getState().extraSelected;
  };

  _getExtraSelected = () => {
    return this.tool.getState().extraSelected;
  };

  _redrawSidebar = (type?: string) => {
    return this.tabControl.redrawTabContent(type);
  };
}

export default AbstractControlState;
