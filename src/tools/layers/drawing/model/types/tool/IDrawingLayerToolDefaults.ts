// Geovisto core
import { ILayerToolDefaults } from "../../../../../../index.core";
import IMapFormInput from "../../../../../../model/types/inputs/IMapFormInput";

export type MappingModel = {
  [key: string]: {
    props: {
      name: string;
      label?: string;
    };
    input: (props: any) => IMapFormInput;
  };
};

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
