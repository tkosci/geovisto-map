import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';
import { createCheck } from '../../../util/inputs';
import AbstractControl from '../AbstractControl/AbstractControl';
import PolyControlState from './PolyControlState';

class PolyControl extends AbstractControl {
  constructor(props) {
    super(props);

    this.state = new PolyControlState({ tabControl: props.tabControl, control: this });
  }

  /**
   * checkbox to set if we can create within selected object
   *
   * @returns {Object} HTML element
   */
  createIntersectionCheck = () => {
    const onChange = (val) => this.state.setIntersectActivated(val);
    const { intersectActivated } = this.state;

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
    const thicknessOpts = this.state.strokes;
    const inputThickness = SidebarInputFactory.createSidebarInput(model.strokeThickness.input, {
      label: model.strokeThickness.label,
      options: thicknessOpts,
      action: this.state.changeWeightAction,
      value: this.state._getSelected()?.options?.weight || this.state.getSelectedStroke(),
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
    colorPicker.onchange = (e) => this.state.changeColorAction(e.target.value);
    colorPicker.value = this.state._getSelected()?.options?.color || this.state.getSelectedColor();
    inputWrapper.appendChild(colorPicker);
    return inputWrapper;
  }
}

export default PolyControl;
