import { createCheck, createIntervalInput } from "../../../util/inputs";
import { EraseTool, PaintTool } from "../../../tools";
import { getIntervalStep } from "../../../util/baseHelpers";
import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";

class BrushControl extends AbstractControl {
  private tabControl: any;
  private customToleranceInput: HTMLDivElement;

  private constructor(props: ControlProps) {
    super();

    this.tabControl = props.tabControl;
    this.customToleranceInput = document.createElement("div");
  }

  /**
   * creates a field for brush size input
   */
  public createBrushSizeControl = (): HTMLDivElement | null => {
    const { drawingTools = {} } = this.tabControl.getTool();

    const paintTool = drawingTools[PaintTool.NAME()];
    const eraseTool = drawingTools[EraseTool.NAME()];

    let brush = null;
    if (paintTool?.isToolActive()) brush = paintTool;
    if (eraseTool?.isToolActive()) brush = eraseTool;

    if (!brush) return null;

    const { maxBrushSize, minBrushSize } = brush.getBrushSizeConstraints();

    const controlWrapper = document.createElement("div");
    const brushControl = createIntervalInput(
      "Brush size: ",
      minBrushSize,
      maxBrushSize,
      brush.resizeBrush,
      brush.getBrushSize()
    );
    controlWrapper.appendChild(brushControl);

    const customToleranceCheck = this.createCustomToleranceCheck();
    controlWrapper.appendChild(customToleranceCheck);

    controlWrapper.appendChild(this.customToleranceInput);
    return controlWrapper;
  };

  private toleranceChange = (val: number): void => {
    window.customTolerance = val;
  };

  private onChange = (check: boolean): void => {
    if (check) {
      const val = window.customTolerance;
      const step = getIntervalStep(val);
      const customTolerance = createIntervalInput(
        "Custom tolerance",
        0.0,
        val * 2,
        this.toleranceChange,
        String(val || ""),
        step
      );
      this.customToleranceInput.appendChild(customTolerance);
    } else {
      const firstChild = this.customToleranceInput.firstChild;
      if (firstChild) this.customToleranceInput.removeChild(firstChild);
      this.tabControl.getTool().setGlobalSimplificationTolerance();
    }
  };

  public createCustomToleranceCheck = (): HTMLDivElement => {
    // * tolerance changes with zoom
    window.map.on("zoomend", () => {
      const firstChild = this.customToleranceInput.firstChild;
      if (firstChild) {
        const interval = firstChild?.firstChild?.lastChild as HTMLInputElement;
        const display = firstChild.lastChild;
        const val = window.customTolerance;
        if (display) (display as HTMLElement).innerText = String(val);
        if (interval) {
          interval.value = String(val);
          const step = getIntervalStep(val);
          interval.step = String(step);
          interval.max = String(val * 2);
        }
      }
    });

    const result = createCheck(
      false,
      this.onChange,
      "custom-tolerance",
      "By selecting the option you can custom level of detail for brush strokes"
    );
    return result;
  };
}

export default BrushControl;
