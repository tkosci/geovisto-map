import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';
import { createCheck } from '../../../components/inputs';

class PolyControl {
  constructor(props) {
    this.tabControl = props.tabControl;
    this.tabState = props.tabControl.getState();
  }

  /**
   * checkbox to set if we can create within selected object
   *
   * @returns {Object} HTML element
   */
  createIntersectionCheck = () => {
    const onChange = (val) => this.tabState.setIntersectActivated(val);
    const { intersectActivated } = this.tabState;

    const result = createCheck(
      intersectActivated,
      onChange,
      'intersect',
      'By selecting the option you can create intersects with selected polygon',
    );
    return result;
  };

  /**
   * creates the fields associated with polygons/polylines
   *
   * @param {Object} elem
   * @param {Object} model
   */
  renderPolyInputs = (elem, model) => {
    // select stroke thickness
    const thicknessOpts = this.tabState.strokes;
    const inputThickness = SidebarInputFactory.createSidebarInput(model.strokeThickness.input, {
      label: model.strokeThickness.label,
      options: thicknessOpts,
      action: this.tabState.changeWeightAction,
      value: this.tabControl._getSelected()?.options?.weight || this.tabState.getSelectedStroke(),
    });
    elem.appendChild(inputThickness.create());

    // palette Colors
    const inputColor = this.createColorPicker();
    elem.appendChild(inputColor);
  };

  /**
   * creates color picker field
   *
   * @returns {Object} HTML element
   */
  createColorPicker() {
    const inputWrapper = document.createElement('div');
    inputWrapper.appendChild(document.createTextNode('Pick color: '));
    const colorPicker = document.createElement('input');
    colorPicker.setAttribute('type', 'color');
    colorPicker.onchange = (e) => this.tabState.changeColorAction(e.target.value);
    colorPicker.value =
      this.tabControl._getSelected()?.options?.color || this.tabState.getSelectedColor();
    inputWrapper.appendChild(colorPicker);
    return inputWrapper;
  }
}

export default PolyControl;
