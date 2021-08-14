import LayerToolDefaults from "../../../model/internal/layer/LayerToolDefaults";
import IDrawingLayerToolDefaults from "./model/types/tool/IDrawingLayerToolDefaults";

/**
 * TODO: refactorization needed!
 */
const TYPE = "drawing";

const INPUT_ID_PREFIX = "geovisto-input-" + TYPE;

/**
 * Data mapping model which can be used in the sidebar form.
 */
export const MAPPING_MODEL = {
  idKey: {
    id: INPUT_ID_PREFIX + "-idKey",
    name: "idKey",
    label: "ID key",
    input: LabeledSelectSidebarInput.ID(),
  },
  identifier: {
    id: INPUT_ID_PREFIX + "-identifier",
    name: "identifier",
    label: "Identifier",
    input: AutocompleteSidebarInput.ID(),
  },
  description: {
    id: INPUT_ID_PREFIX + "-description",
    name: "description",
    label: "Description",
    input: LabeledTextAreaSidebarInput.ID(),
  },
  strokeThickness: {
    id: INPUT_ID_PREFIX + "-stroke-thickness",
    name: "stroke-thickness",
    label: "Stroke thickness",
    input: LabeledSelectSidebarInput.ID(),
  },
  search: {
    id: INPUT_ID_PREFIX + "-search",
    name: "search",
    label: "Search",
    input: AutocompleteSidebarInput.ID(),
  },
  searchForArea: {
    id: INPUT_ID_PREFIX + "-search-for-area",
    name: "search-for-area",
    label: "Search",
    input: LabeledSelectSidebarInput.ID(),
  },
  adminLevel: {
    id: INPUT_ID_PREFIX + "-admin-level",
    name: "admin-level",
    label: "Pick level of administration",
    input: LabeledSelectSidebarInput.ID(),
  },
  iconUrl: {
    id: INPUT_ID_PREFIX + "-iconUrl",
    name: "iconUrl",
    label: "Icon URL",
    input: LabeledTextSidebarInput.ID(),
  },
  dataFilterKey: {
    id: INPUT_ID_PREFIX + "-data-filter-key",
    name: "data-filter-key",
    label: "Pick column",
    input: LabeledSelectSidebarInput.ID(),
  },
  dataFilterValue: {
    id: INPUT_ID_PREFIX + "-data-filter-value",
    name: "data-filter-value",
    label: "Pick value",
    input: LabeledSelectSidebarInput.ID(),
  },
};

/**
 * This class provide functions which return the default state values.
 *
 * @author Andrej Tlcina
 */
class DrawingLayerToolDefaults
  extends LayerToolDefaults
  implements IDrawingLayerToolDefaults {
  public static TYPE = "geovisto-tool-layer-drawing";
  /**
   * It initializes tool defaults.
   */
  public constructor() {
    super();
  }
  /**
   * A unique string of the tool type.
   */
  public getType(): string {
    return DrawingLayerToolDefaults.TYPE;
  }

  /**
   * It returns the layer name.
   */
  public getLayerName(): string {
    return "Drawing layer";
  }

  /**
   * It returns the label of the tool.
   */
  public getLabel(): string {
    return this.getLayerName();
  }

  /**
   * It returns the icon of the tool.
   */
  public getIcon(): string {
    return '<i class="fa fa-pencil"></i>';
  }
}
export default DrawingLayerToolDefaults;
