import DrawingLayerToolTabControlDefaults from './DrawingLayerToolTabControlDefaults';
import DrawingLayerToolTabControlState from './DrawingLayerToolTabControlState';
import AbstractLayerToolTabControl from '../../abstract/sidebar/AbstractLayerToolTabControl';

import { MarkerTool, PaintTool, PolygonTool, SearchTool } from '../tools';

import '../style/drawingLayerTabControl.scss';
import { isEmpty } from '../util/baseHelpers';

const POLYS = ['polyline', 'polygon', 'painted', 'vertice'];

const C_sidebar_tab_content_class = 'leaflet-sidebar-tab-content';

/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolTabControl extends AbstractLayerToolTabControl {
  constructor(tool) {
    super(tool);
  }

  /**
   * It creates new defaults of the tab control.
   */
  createDefaults() {
    return new DrawingLayerToolTabControlDefaults();
  }

  /**
   * It creates new state of the tab control.
   */
  createState() {
    return new DrawingLayerToolTabControlState(this);
  }

  /**
   * removes all elements of a sidebar and calls function to create new content of the sidebar
   *
   * @param {String} layerType
   * @param {Boolean} enabled
   */
  redrawTabContent(layerType, enabled = false) {
    console.log('redrawing sidebar...');
    // get rendered sidebar tab
    let tabElement = document.getElementById(this.getState().getId());

    // create sidebar tab content
    let tabContent = tabElement.getElementsByClassName(C_sidebar_tab_content_class)[0];

    while (tabContent.firstChild) {
      tabContent.removeChild(tabContent.firstChild);
    }

    tabContent.appendChild(this.getTabContent(layerType, enabled));
  }

  /**
   * It returns the sidebar tab pane.
   *
   * @param {string} layerType
   * @param {boolean} enabled
   * @returns
   */
  getTabContent(layerType = null, enabled = false) {
    const { controls } = this.getState();

    // tab content
    let tab = document.createElement('div');
    let elem = tab.appendChild(document.createElement('div'));
    elem.classList.add('drawing-sidebar');

    if (isEmpty(controls)) return tab;

    // get data mapping model
    let model = this.getDefaults().getDataMappingModel();

    let brushControl = controls['BrushControl'].createBrushSizeControl();
    if (brushControl) elem.appendChild(brushControl);

    if (!layerType) {
      controls['DataControl'].state.clearFilters();
      return tab;
    }

    if (layerType === SearchTool.result) {
      controls['SearchControl'].renderSearchInputs(elem, model);
      controls['DataControl'].state.clearFilters();
      return tab;
    }

    controls['DataControl'].renderDataInputs(elem, model);
    controls['DataControl'].renderDataFilters(elem, model);
    controls['DataControl'].renderFilterInputs(elem, model);

    if (layerType === PaintTool.result || layerType === PolygonTool.result) {
      const intersectCheck = controls['PolyControl'].createIntersectionCheck();
      elem.appendChild(intersectCheck);
    }

    if (POLYS.includes(layerType)) {
      controls['PolyControl'].renderPolyInputs(elem, model);
    }

    if (layerType === MarkerTool.result) {
      controls['MarkerControl'].renderIconInputs(elem, model);
    }

    return tab;
  }
}
export default DrawingLayerToolTabControl;
