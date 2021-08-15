import { TMarkerControlState } from "./components/MarkerControl/types";
import DataControl from "./components/DataControl/DataControl";
import MarkerControl from "./components/MarkerControl/MarkerControl";
import PolyControl from "./components/PolyControl/PolyControl";
import BrushControl from "./components/BrushControl/BrushControl";
import SearchControl from "./components/SearchControl/SearchControl";
import {
  DrawingForm,
  EnabledEl,
  TabState,
} from "../model/types/tool/IDrawingLayerTool";
import { TPolyControlState } from "./components/PolyControl/types";
import { TDataControlState } from "./components/DataControl/types";
import { DrawnObject, LooseObject } from "../model/types";

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolMapFormState implements TabState {
  public tabControl: DrawingForm;
  public enabledEl: EnabledEl;
  public guideLayers: DrawnObject[];
  public controls: LooseObject;
  /**
   * It creates a tab control state.
   */
  public constructor(tabControl: DrawingForm) {
    this.tabControl = tabControl;

    // * element/layer that was enabled and not created yet
    this.enabledEl = null;

    this.guideLayers = [];

    this.controls = {};
  }

  /**
   * method initializes controls for objects manipulation
   */
  public initializeControls = (): void => {
    const { tabControl } = this;
    const controls: LooseObject = {};

    controls["DataControl"] = new DataControl({ tabControl });
    controls["MarkerControl"] = new MarkerControl({ tabControl });
    controls["PolyControl"] = new PolyControl({ tabControl });
    controls["SearchControl"] = new SearchControl({ tabControl });
    controls["BrushControl"] = new BrushControl({ tabControl });

    this.controls = controls;
  };

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public getSelectedColor(): string {
    const state = this.controls["PolyControl"]?.state as TPolyControlState;
    return state?.getSelectedColor();
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public getSelectedStroke(): number {
    const state = this.controls["PolyControl"]?.state as TPolyControlState;
    return state?.getSelectedStroke();
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public getSelectedIcon(): string {
    const state = this.controls["MarkerControl"]?.state as TMarkerControlState;
    return state?.getSelectedIcon();
  }

  public setSelectedIcon(icon: string): void {
    this.controls["MarkerControl"]?.state?.setSelectedIcon(icon);
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public callIdentifierChange(haveToCheckFilters = false): void {
    const state = this.controls["DataControl"]?.state as TDataControlState;
    return state?.callIdentifierChange(haveToCheckFilters);
  }

  /**
   * method if defined for easier access through tabControlState class/object
   */
  public appendToIconSrcs(iconUrl: string): void {
    const state = this.controls["MarkerControl"]?.state as TMarkerControlState;
    return state?.appendToIconSrcs(iconUrl);
  }

  /**
   * adds guide layer for snapping
   */
  public pushGuideLayer(layer: DrawnObject): void {
    this.guideLayers.push(layer);
  }

  /**
   * setter for enabledEl variable
   */
  public setEnabledTool(val: EnabledEl): void {
    this.enabledEl?.disable();
    this.enabledEl = val;
  }

  /**
   * getter
   */
  public getEnabledTool(): EnabledEl {
    return this.enabledEl;
  }
}
export default DrawingLayerToolMapFormState;
