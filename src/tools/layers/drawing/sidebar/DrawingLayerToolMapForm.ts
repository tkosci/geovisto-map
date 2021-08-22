import DrawingLayerToolMapFormState from "./DrawingLayerToolMapFormState";

import { MarkerTool, PaintTool, PolygonTool, SearchTool } from "../tools";

import "../style/drawingLayerTabControl.scss";
import { isEmpty } from "../util/baseHelpers";
import MapLayerToolForm from "../../../../model/internal/form/MapLayerToolForm";
import IDrawingLayerTool, {
  DrawingForm,
  TabState,
} from "../model/types/tool/IDrawingLayerTool";
import { LayerType, LooseObject } from "../model/types";
import { MAPPING_MODEL } from "../DrawingLayerToolDefaults";
import IDrawingLayerToolDimensions from "../model/types/tool/IDrawingLayerToolDimensions";
import { FIRST } from "../util/constants";

const POLYS = ["polyline", "polygon", "painted", "vertice"];

const tabContentClassName = "drawing-sidebar";

/**
 * This class provides controls for management of the layer sidebar tab.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolMapForm
  extends MapLayerToolForm<IDrawingLayerTool>
  implements DrawingForm {
  private htmlContent!: HTMLDivElement;

  private tool: IDrawingLayerTool;
  private state: TabState;

  public constructor(props: { tool: IDrawingLayerTool }) {
    super(props.tool);

    this.tool = props.tool;
    this.state = new DrawingLayerToolMapFormState(this);
  }

  public setInputValues(dimensions: IDrawingLayerToolDimensions): void {
    return;
  }

  public getTool(): IDrawingLayerTool {
    return this.tool;
  }

  /**
   * It creates new state of the tab control.
   */
  public getState(): TabState {
    return this.state;
  }

  /**
   * removes all elements of a sidebar and calls function to create new content of the sidebar
   */
  public redrawTabContent(layerType: LayerType | ""): void {
    console.log("redrawing sidebar...");

    // create sidebar tab content
    const tabContent = document.getElementsByClassName(tabContentClassName)[
      FIRST
    ];

    while (tabContent.firstChild) {
      tabContent.removeChild(tabContent.firstChild);
    }

    tabContent.appendChild(this.getContent(layerType));
  }

  /**
   * It returns the sidebar tab pane.
   */
  public getContent(layerType: LayerType | "" = ""): HTMLDivElement {
    const { controls } = this.getState();

    // tab content
    this.htmlContent = document.createElement("div");
    const elem = this.htmlContent.appendChild(document.createElement("div"));
    elem.classList.add(tabContentClassName);

    if (!controls || isEmpty<LooseObject>(controls)) return this.htmlContent;

    // get data mapping model
    const model = MAPPING_MODEL;

    const brushControl = controls["BrushControl"].createBrushSizeControl();
    if (brushControl) elem.appendChild(brushControl);

    if (!layerType) {
      controls["DataControl"].state.clearFilters();
      return this.htmlContent;
    }

    if (layerType === SearchTool.result) {
      controls["SearchControl"].renderSearchInputs(elem, model);
      controls["DataControl"].state.clearFilters();
      return this.htmlContent;
    }

    controls["DataControl"].renderDataInputs(elem, model);
    controls["DataControl"].renderDataFilters(elem, model);
    controls["DataControl"].renderFilterInputs(elem);

    if (layerType === PaintTool.result || layerType === PolygonTool.result) {
      const intersectCheck = controls["PolyControl"].createIntersectionCheck();
      elem.appendChild(intersectCheck);
    }

    if (POLYS.includes(layerType)) {
      controls["PolyControl"].renderPolyInputs(elem, model);
    }

    if (layerType === MarkerTool.result) {
      controls["MarkerControl"].renderIconInputs(elem, model);
    }

    return this.htmlContent;
  }
}
export default DrawingLayerToolMapForm;
