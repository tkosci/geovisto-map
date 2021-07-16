import { COLORS, STROKES } from '../../../util/constants';
import AbstractControlState from '../AbstractControl/AbstractControlState';

class PolyControlState extends AbstractControlState {
  constructor(props) {
    super(props);

    this.intersectActivated = false;

    this.colors = COLORS;
    this.selectedColor = COLORS[0];

    this.strokes = STROKES;
    this.selectedStroke = STROKES[1].value;
  }

  /**
   * getter
   *
   * @returns {String}
   */
  getSelectedColor() {
    return this.selectedColor;
  }

  /**
   * getter
   *
   * @returns {String}
   */
  getSelectedStroke() {
    return this.selectedStroke;
  }

  /**
   * sets whether we are creating new polygons within selected one
   *
   * @param {Boolean} val
   */
  setIntersectActivated(val) {
    this.intersectActivated = val;
  }

  /**
   * sets new color to selected object and to extra selected ones
   *
   * @param {string} color
   */
  changeColorAction = (color) => {
    const selectedEl = this._getSelected();
    this.selectedColor = color;
    if (selectedEl?.setStyle) selectedEl.setStyle({ color });
    this._getExtraSelected().forEach((layer) => {
      layer?.setStyle({ color });
    });
  };

  /**
   * sets new stroke weight to selected object and to extra selected ones
   *
   * @param {Object} e
   */
  changeWeightAction = (e) => {
    const weight = Number(e.target.value);
    const selectedEl = this._getSelected();
    this.selectedStroke = weight;
    if (selectedEl?.setStyle) selectedEl.setStyle({ weight });
    this._getExtraSelected().forEach((layer) => {
      layer?.setStyle({ weight });
    });
  };
}

export default PolyControlState;
