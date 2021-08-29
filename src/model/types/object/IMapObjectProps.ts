import { ExportGeoJSON } from "../../../tools/layers/drawing/model/types/tool/IDrawingLayerToolState";
import IMapObjectConfig from "./IMapObjectConfig";

/**
 * This type provides the specification of the map object props model.
 *
 * @author Jiri Hynek
 */
type IMapObjectProps = {
    id?: string;
};

/**
 * This type provides the specification of the map object props model used in its initialization.
 *
 * @author Jiri Hynek
 */
type IMapObjectInitProps<TConfig extends IMapObjectConfig = IMapObjectConfig> = {
    config?: TConfig;
    geojson?: ExportGeoJSON;
};
export type { IMapObjectProps, IMapObjectInitProps };