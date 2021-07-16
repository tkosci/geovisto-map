import SidebarInputFactory from '../../../../../../inputs/SidebarInputFactory';
import { createCheck, createIntervalInput, createPalette } from '../../../components/inputs';
import { iconStarter } from '../../../util/constants';
import AbstractControl from '../AbstractControl/AbstractControl';
import MarkerControlState from './MarkerControlState';

class MarkerControl extends AbstractControl {
  constructor(props) {
    super(props);

    this.tabControl = props.tabControl;
    this.tabState = props.tabControl.getState();

    this.state = new MarkerControlState({ tabControl: props.tabControl, control: this });
  }

  /**
   * creates a icon grid
   *
   * @returns {Object} HTML element
   */
  createIconPalette() {
    const iconsSet = this.state.iconSrcs;
    const iconUrl = this.tabControl._getSelected()?.options?.icon?.options?.iconUrl;
    if (iconUrl) iconsSet.add(iconUrl);
    const activeIcon = this.state.getSelectedIcon();
    const iconsArr = Array.from(iconsSet);
    const activeIndex = iconsArr.indexOf(activeIcon);
    const res = createPalette(
      'Pick icon',
      iconsArr,
      activeIndex,
      this.state.changeIconAction,
      true,
    );
    return res;
  }

  /**
   * slider for anchor change
   *
   * @returns {Object} HTML element
   */
  createIconAnchorSlider = (coordinate: 'x' | 'y') => {
    const selectedEl = this.tabControl._getSelected();

    let iconOptions = selectedEl?.options?.icon?.options || {};
    const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
    const value = iconAnchor[coordinate] || '';

    const customAnchor = createIntervalInput(
      `Icon '${coordinate.toUpperCase()}' anchor`,
      0,
      50,
      (val) => this.state.changeIconAnchor(val, coordinate),
      value,
      1,
    );

    return customAnchor;
  };

  /**
   * X coordinate slider
   *
   * @returns {Object} HTML element
   */
  createXAnchorSlider = () => this.createIconAnchorSlider('x');

  /**
   * Y coordinate slider
   *
   * @returns {Object} HTML element
   */
  createYAnchorSlider = () => this.createIconAnchorSlider('y');

  /**
   * checkbox to set if marker is connect marker
   *
   * @returns {Object} HTML element
   */
  createChangeConnectCheck = () => {
    const toolState = this.tabControl.getTool().getState();
    const onChange = (connectClick) => {
      let selected = this.state.changeIconOpts({ connectClick });

      if (selected) {
        this.tabControl.getTool().highlightElement(selected);
      }
    };
    const isConnect = toolState.selectedLayerIsConnectMarker();

    const result = createCheck(
      isConnect,
      onChange,
      'change-connect',
      'By selecting the option marker will be able to create topology',
    );
    return result;
  };

  /**
   * creates the fields associated with marker
   *
   * @param {Object} elem
   * @param {Object} model
   */
  renderIconInputs = (elem, model) => {
    // palette Icons
    const inputIcon = this.createIconPalette();
    elem.appendChild(inputIcon);

    const inputUrl = SidebarInputFactory.createSidebarInput(model.iconUrl.input, {
      label: model.iconUrl.label,
      action: this.state.addIconAction,
      value: '',
    });

    elem.appendChild(inputUrl.create());

    const changeConnect = this.createChangeConnectCheck();
    elem.appendChild(changeConnect);

    elem.appendChild(this.createXAnchorSlider());
    elem.appendChild(this.createYAnchorSlider());
  };
}

export default MarkerControl;
