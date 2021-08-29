import { ExportGeoJSON } from './../../../tools/layers/drawing/model/types/tool/IDrawingLayerToolState';

import IMap from "../map/IMap";
import { IMapObjectProps, IMapObjectInitProps } from "../object/IMapObjectProps";
import IMapToolConfig from "./IMapToolConfig";

/**
 * This type provides the specification of the map tool props model.
 * 
 * @author Jiri Hynek
 */
type IMapToolProps = IMapObjectProps & {
    enabled?: boolean,
    label?: string,
    icon?: string
}

/**
 * This type provides the specification of the map tool props model used in its initialization.
 * 
 * @author Jiri Hynek
 */
type IMapToolInitProps<TConfig extends IMapToolConfig = IMapToolConfig> = IMapObjectInitProps<TConfig> & {
    map : IMap;
    geojson?: ExportGeoJSON
}
export type { IMapToolProps, IMapToolInitProps };