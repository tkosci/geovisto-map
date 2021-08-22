import { MappingModel } from "../../../model/types/tool/IDrawingLayerToolDefaults";
import { createCheck } from "../../../util/inputs";
import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps, TAbstractControl } from "../AbstractControl/types";
import PolyControlState from "./PolyControlState";
import { TPolyControlState } from "./types";

class PolyControl
  extends AbstractControl
  implements TAbstractControl<TPolyControlState> {
  public state;

  public constructor(props: ControlProps) {
    super(props);

    this.state = new PolyControlState({
      tabControl: props.tabControl,
      control: this,
    });
  }

  /**
   * checkbox to set if we can create within selected object
   */
  public createIntersectionCheck = (): HTMLDivElement => {
    const onChange = (val: boolean) => this.state.setIntersectActivated(val);
    const { intersectActivated } = this.state;

    const result = createCheck(
      intersectActivated,
      onChange,
      "intersect",
      "By selecting the option you can create intersects with selected polygon"
    );
    return result;
  };

  /**
   * creates the fields associated with polygons/polylines
   *
   * @param {Object} elem
   * @param {Object} model
   */
  public renderPolyInputs = (
    elem: HTMLDivElement,
    model: MappingModel
  ): void => {
    // select stroke thickness
    const thicknessOpts = this.state.strokes;
    const inputThickness = model.strokeThickness.input({
      ...model.strokeThickness.props,
      options: thicknessOpts,
      action: this.state.changeWeightAction,
    });
    elem.appendChild(inputThickness.create() as Node);
    inputThickness.setValue(
      this.state._getSelected()?.options?.weight ||
        this.state.getSelectedStroke()
    );

    // palette Colors
    const inputColor = this.createColorPicker();
    elem.appendChild(inputColor);
  };

  /**
   * creates color picker field
   */
  private createColorPicker(): HTMLDivElement {
    const inputWrapper = document.createElement("div");
    inputWrapper.appendChild(document.createTextNode("Pick color: "));
    const colorPicker = document.createElement("input");
    colorPicker.setAttribute("type", "color");
    colorPicker.onchange = (e) =>
      this.state.changeColorAction((e.target as HTMLInputElement).value);
    colorPicker.value = String(
      this.state._getSelected()?.options?.color || this.state.getSelectedColor()
    );
    inputWrapper.appendChild(colorPicker);
    return inputWrapper;
  }
}

export default PolyControl;
