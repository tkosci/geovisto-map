import MapFormInputFactory from "../../../model/internal/inputs/MapFormInputFactory";
import LayerToolDefaults from "../../../model/internal/layer/LayerToolDefaults";
import IDrawingLayerToolDefaults, {
  MappingModel,
} from "./model/types/tool/IDrawingLayerToolDefaults";

/**
 * TODO: refactorization needed!
 */

const FormInput = new MapFormInputFactory();

/**
 * Data mapping model which can be used in the sidebar form.
 */
export const MAPPING_MODEL: MappingModel = {
  idKey: {
    props: {
      name: "idKey",
      label: "ID key",
    },
    input: FormInput.labeledSelect,
  },
  identifier: {
    props: { name: "identifier", label: "Identifier" },
    input: FormInput.labeledAutocomplete,
  },
  description: {
    props: { name: "description", label: "Description" },
    input: FormInput.textarea,
  },
  strokeThickness: {
    props: {
      name: "stroke-thickness",
      label: "Stroke thickness",
    },
    input: FormInput.labeledSelect,
  },
  search: {
    props: { name: "search", label: "Search" },
    input: FormInput.labeledAutocomplete,
  },
  searchForArea: {
    props: {
      name: "search-for-area",
      label: "Search",
    },
    input: FormInput.labeledSelect,
  },
  adminLevel: {
    props: {
      name: "admin-level",
      label: "Pick level of administration",
    },
    input: FormInput.labeledSelect,
  },
  iconUrl: {
    props: {
      name: "iconUrl",
      label: "Icon URL",
    },
    input: FormInput.labeledText,
  },
  dataFilterKey: {
    props: {
      name: "data-filter-key",
      label: "Pick column",
    },
    input: FormInput.labeledSelect,
  },
  dataFilterValue: {
    props: {
      name: "data-filter-value",
      label: "Pick value",
    },
    input: FormInput.labeledSelect,
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
