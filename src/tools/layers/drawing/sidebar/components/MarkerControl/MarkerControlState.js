import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { FIRST, iconStarter, ICON_SRCS } from '../../../util/constants';
import AbstractControlState from '../AbstractControl/AbstractControlState';

class MarkerControlState extends AbstractControlState {
  constructor(props) {
    super(props);

    this.iconSrcs = new Set(ICON_SRCS);
    this.selectedIcon = ICON_SRCS[FIRST];
  }

  /**
   * getter
   *
   * @returns {String}
   */
  getSelectedIcon() {
    return this.selectedIcon;
  }

  /**
   * sets new marker icon options (iconUrl, anchor...) to selected object and to extra selected ones
   *
   * @param {Object} iconOpt
   * @returns {Layer}
   */
  changeIconOpts = (iconOpt = {}) => {
    const { enabledEl } = this;

    let selectedEl = this._getSelected();
    let marker = selectedEl;

    if (enabledEl?.type === 'marker') {
      selectedEl = enabledEl;
      marker = enabledEl._marker;
    }

    let oldIconOptions = selectedEl?.options?.icon?.options || {};
    let newIconOptions = {
      ...oldIconOptions,
      ...iconOpt,
    };

    const markerIcon = new L.Icon(newIconOptions);
    if (marker) marker.setIcon(markerIcon);
    this.tool.highlightElement(marker);
    this._getExtraSelected().forEach((layer) => {
      layer?.setIcon(markerIcon);
      this.tool.highlightElement(layer);
    });
    if (enabledEl?.type === 'marker') enabledEl.setIconOptions(markerIcon);

    return marker;
  };

  /**
   * sets new icon to marker
   *
   * @param {String} icon
   */
  changeIconAction = (icon) => {
    this.changeIconOpts({ iconUrl: icon });

    this.selectedIcon = icon;
    this._redrawSidebar('marker');
  };

  /**
   * sets new anchor to marker
   *
   * @param {Number} val
   * @param {'x' | 'y'} coordinate
   */
  changeIconAnchor = (val, coordinate) => {
    const selectedEl = this.enabledEl || this._getSelected();
    let iconOptions = selectedEl?.options?.icon?.options || {};
    const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
    iconAnchor[coordinate] = val;
    this.changeIconOpts({ iconAnchor });
  };

  /**
   * runs on 'Enter' whenever user adds new icon to list of icons
   *
   * @param {Object} e
   */
  addIconAction = (e) => {
    const iconUrl = e.target.value;
    this.appendToIconSrcs(iconUrl);
    this._redrawSidebar('marker');
  };

  /**
   * append to icon Set
   *
   * @param {string} iconUrl
   */
  appendToIconSrcs(iconUrl) {
    this.iconSrcs.add(iconUrl);
  }
}

export default MarkerControlState;
