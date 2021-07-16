import L from 'leaflet';

import AbstractLayerToolTabControlState from '../../abstract/sidebar/AbstractLayerToolTabControlState';

import '../style/drawingLayerTabControl.scss';

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

  /**
   * returns state of a drawing tool
   *
   * @returns {Object}
   */
  getToolState() {
    return this.getTool().getState();
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
