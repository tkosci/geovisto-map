import L from 'leaflet';

import AbstractLayerToolTabControlState from '../../abstract/sidebar/AbstractLayerToolTabControlState';

import '../style/drawingLayerTabControl.scss';

import DataControl from './components/DataControl/DataControl';
import MarkerControl from './components/MarkerControl/MarkerControl';
import PolyControl from './components/PolyControl/PolyControl';
import BrushControl from './components/BrushControl/BrushControl';
import SearchControl from './components/SearchControl/SearchControl';

/**
 * This class manages the state of the sidebar tab.
 * It wraps the state since the sidebar tab can work with state objects which needs to be explicitly serialized.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolTabControlState extends AbstractLayerToolTabControlState {
  /**
   * It creates a tab control state.
   */
  constructor(tabControl) {
    super();
    this.tabControl = tabControl;

    // * element/layer that was enabled and not created yet
    this.enabledEl = null;

    this.guideLayers = [];

    this.controls = {};
  }

  initializeControls = () => {
    const { tabControl } = this;
    const controls = {};

    controls['DataControl'] = new DataControl({ tabControl });
    controls['MarkerControl'] = new MarkerControl({ tabControl });
    controls['PolyControl'] = new PolyControl({ tabControl });
    controls['SearchControl'] = new SearchControl({ tabControl });
    controls['BrushControl'] = new BrushControl({ tabControl });

    this.controls = controls;
  };

  getSelectedColor() {
    return this.controls['PolyControl']?.state?.getSelectedColor();
  }

  getSelectedStroke() {
    return this.controls['PolyControl']?.state?.getSelectedStroke();
  }

  getSelectedIcon() {
    return this.controls['MarkerControl']?.state?.getSelectedIcon();
  }

  callIdentifierChange(haveToCheckFilters = false) {
    return this.controls['DataControl']?.state?.callIdentifierChange(haveToCheckFilters);
  }

  /**
   * adds guide layer for snapping
   *
   * @param {Layer} layer
   */
  pushGuideLayer(layer) {
    this.guideLayers.push(layer);
  }

  setEnabledTool(val) {
    this.enabledEl?.disable();
    this.enabledEl = val;
  }

  /**
   * getter
   *
   * @returns {object}
   */
  getEnabledTool() {
    return this.enabledEl;
  }
}
export default DrawingLayerToolTabControlState;
