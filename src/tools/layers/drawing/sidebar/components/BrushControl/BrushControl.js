import { createCheck, createIntervalInput } from '../../../components/inputs';
import { EraseTool, PaintTool } from '../../../tools';
import { getIntervalStep } from '../../../util/functionUtils';

class BrushControl {
  constructor(props) {
    this.tabControl = props.tabControl;
    this.tabState = props.tabControl.getState();
  }

  /**
   * creates a field for brush size input
   *
   * @returns {Object} HTML element
   */
  createBrushSizeControl = () => {
    const { drawingTools = {} } = this.tabControl.getTool();

    const paintTool = drawingTools[PaintTool.NAME()];
    const eraseTool = drawingTools[EraseTool.NAME()];

    let brush = null;
    if (paintTool?.isToolActive()) brush = paintTool;
    if (eraseTool?.isToolActive()) brush = eraseTool;

    if (!brush) return null;

    let { maxBrushSize, minBrushSize } = brush.getBrushSizeConstraints();

    const controlWrapper = document.createElement('div');
    const brushControl = createIntervalInput(
      'Brush size: ',
      minBrushSize,
      maxBrushSize,
      brush.resizeBrush,
      brush.getBrushSize(),
    );
    controlWrapper.appendChild(brushControl);

    const customToleranceCheck = this.createCustomToleranceCheck();
    controlWrapper.appendChild(customToleranceCheck);

    this.customToleranceInput = document.createElement('div');
    controlWrapper.appendChild(this.customToleranceInput);
    return controlWrapper;
  };

  toleranceChange = (val) => {
    window.customTolerance = val;
  };

  onChange = (check) => {
    if (check) {
      let val = window.customTolerance;
      let step = getIntervalStep(val);
      const customTolerance = createIntervalInput(
        'Custom tolerance',
        0.0,
        val * 2,
        this.toleranceChange,
        val || '',
        step,
      );
      this.customToleranceInput.appendChild(customTolerance);
    } else {
      let firstChild = this.customToleranceInput.firstChild;
      if (firstChild) this.customToleranceInput.removeChild(firstChild);
      this.tabControl.getTool().setGlobalSimplificationTolerance();
    }
  };

  /**
   * slider to change tolerance of brush stroke a.k.a how smooth it will be
   *
   * @returns {Object} HTML element
   */
  createCustomToleranceCheck = () => {
    // * tolerance changes with zoom
    window.map.on('zoomend', () => {
      let firstChild = this.customToleranceInput.firstChild;
      if (firstChild) {
        let interval = firstChild.firstChild.lastChild;
        let display = firstChild.lastChild;
        let val = window.customTolerance;
        if (display) display.innerText = val;
        if (interval) {
          interval.value = val;
          let step = getIntervalStep(val);
          interval.step = step;
          interval.max = val * 2;
        }
      }
    });

    const result = createCheck(
      '',
      this.onChange,
      'custom-tolerance',
      'By selecting the option you can custom level of detail for brush strokes',
    );
    return result;
  };
}

export default BrushControl;
