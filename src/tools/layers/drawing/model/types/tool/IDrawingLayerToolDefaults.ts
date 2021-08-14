// Geovisto core
import { ILayerToolDefaults } from "../../../../../../index.core";

/**
 * This interface provides functions which return the default state values.
 *
 * @author Jiri Hynek
 */
interface IDrawingLayerToolDefaults extends ILayerToolDefaults {
  getType(): string;
  getLayerName(): string;
  getLabel(): string;
  getIcon(): string;
}
export default IDrawingLayerToolDefaults;
