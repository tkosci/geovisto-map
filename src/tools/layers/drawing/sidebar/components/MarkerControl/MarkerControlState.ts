import { TMarkerControlState } from './types';
import { DrawnObject } from './../../../model/types/index';
import L from 'leaflet';
import 'leaflet-path-drag';
import 'leaflet-path-transform';
import 'leaflet-draw';

import { FIRST, iconStarter, ICON_SRCS } from '../../../util/constants';
import AbstractControlState from '../AbstractControl/AbstractControlState';
import { ControlStateProps } from '../AbstractControl/types';

class MarkerControlState extends AbstractControlState implements TMarkerControlState {
  public iconSrcs: Set<string>;
  public selectedIcon: string;

  constructor(props: ControlStateProps) {
    super(props);

    this.iconSrcs = new Set(ICON_SRCS);
    this.selectedIcon = ICON_SRCS[FIRST];
  }

  /**
   * getter
   */
  getSelectedIcon(): string {
    return this.selectedIcon;
  }

  /**
   * setter
   */
  setSelectedIcon(icon: string): void {
    this.selectedIcon = icon;
  }

  /**
   * sets new marker icon options (iconUrl, anchor...) to selected object and to extra selected ones
   */
  changeIconOpts = (iconOpt = {}): DrawnObject => {
    const { enabledEl } = this.tabControl;

    let selectedEl = this._getSelected();
    let marker = selectedEl;

    if (enabledEl?.type === 'marker') {
      selectedEl = enabledEl;
      marker = enabledEl._marker;
    }

    const oldIconOptions = selectedEl?.options?.icon?.options || {};
    const newIconOptions = {
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
  changeIconAction = (icon: string): void => {
    this.changeIconOpts({ iconUrl: icon });

    this.selectedIcon = icon;
    this._redrawSidebar('marker');
  };

  /**
   * sets new anchor to marker
   */
  changeIconAnchor = (val: number, coordinate: 'x' | 'y'): void => {
    const selectedEl = this.tabControl.enabledEl || this._getSelected();
    const iconOptions = selectedEl?.options?.icon?.options || {};
    const iconAnchor = iconOptions.iconAnchor || iconStarter.iconAnchor;
    iconAnchor[coordinate] = val;
    this.changeIconOpts({ iconAnchor });
  };

  /**
   * runs on 'Enter' whenever user adds new icon to list of icons
   */
  addIconAction = (e: InputEvent): void => {
    const iconUrl = (e.target as HTMLInputElement).value;
    this.appendToIconSrcs(iconUrl);
    this._redrawSidebar('marker');
  };

  /**
   * append to icon Set
   */
  appendToIconSrcs(iconUrl: string): void {
    this.iconSrcs.add(iconUrl);
  }
}

export default MarkerControlState;
