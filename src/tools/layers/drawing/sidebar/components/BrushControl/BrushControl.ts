import { createCheck, MAPPING_MODEL } from "../../../util/inputs";
import { EraseTool, PaintTool } from "../../../tools";
import { getIntervalStep } from "../../../util/baseHelpers";
import AbstractControl from "../AbstractControl/AbstractControl";
import { ControlProps } from "../AbstractControl/types";
import { TBrushControl } from "./types";
import { TPaintTool } from "../../../tools/PaintTool/types";
import { TEraseTool } from "../../../tools/EraseTool/types";

class BrushControl extends AbstractControl implements TBrushControl {
  private tabControl;
  private customToleranceInput: HTMLDivElement;

  public constructor(props: ControlProps) {
    super(props);

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

    let brush: TPaintTool | TEraseTool | null = null;
    if (paintTool?.isToolActive()) brush = paintTool as TPaintTool;
    if (eraseTool?.isToolActive()) brush = eraseTool as TEraseTool;

    if (!brush) return null;

    const { maxBrushSize, minBrushSize } = brush.getBrushSizeConstraints();

    const controlWrapper = document.createElement("div");
    const brushControl = MAPPING_MODEL.brushSize.input({
      onChangeAction: (e: Event) =>
        brush?.resizeBrush(Number((e.target as HTMLInputElement).value)),
      label: "Brush size: ",
      defaultValue: brush.getBrushSize(),
      maxValue: maxBrushSize,
      minValue: minBrushSize,
    });
    controlWrapper.appendChild(brushControl.create());

    const customToleranceCheck = this.createCustomToleranceCheck();
    controlWrapper.appendChild(customToleranceCheck);

    controlWrapper.appendChild(this.customToleranceInput);
    return controlWrapper;
  };

  private toleranceChange = (e: Event): void => {
    const val = Number((e.target as HTMLInputElement).value);
    window.customTolerance = val;
  };

  private onChange = (check: boolean): void => {
    if (check) {
      const val = window.customTolerance;
      const step = getIntervalStep(val);
      const customTolerance = MAPPING_MODEL.customTolerance.input({
        label: "Custom tolerance",
        onChangeAction: (e: Event) => this.toleranceChange(e),
        minValue: 0.0,
        maxValue: val * 2,
        defaultValue: String(val || ""),
        step: step,
      });
      this.customToleranceInput.appendChild(customTolerance.create());
    } else {
      const firstChild = this.customToleranceInput.firstChild;
      if (firstChild) this.customToleranceInput.removeChild(firstChild);
      this.tabControl.getTool().setGlobalSimplificationTolerance();
    }
  };

  private createCustomToleranceCheck = (): HTMLDivElement => {
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
