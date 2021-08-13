import { DrawnObject } from "../../../model/types";
import { TAbstractControlState } from "./types";

/**
 * Abstract class for control state.
 *
 * control gives inputs for manipulation of created objects
 *
 * class should should contain only methods for data and logic of inputs, not rendering
 */
class AbstractControlState implements TAbstractControlState {
  public tabControl: any;
  public tool: any;
  public control: any;

  public constructor(props: { tabControl: any; control: any }) {
    this.tabControl = props.tabControl;
    this.tool = props.tabControl.getTool();
    this.control = props.control;
  }

  public _getSelected = (): DrawnObject => {
    return this.tool.getState().selectedLayer;
  };

  public _getExtraSelected = (): Array<DrawnObject> => {
    return this.tool.getState().extraSelected;
  };

  public _redrawSidebar = (type?: string): void => {
    return this.tabControl.redrawTabContent(type);
  };
}

export default AbstractControlState;
