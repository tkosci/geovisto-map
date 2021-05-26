import { 
    IMarkerLayerToolProps,
    IMarkerLayerTool,
    MarkerLayerTool
} from '.';

export const GeovistoMarkerLayerTool: {
    getType: () => string,
    createTool: (props: IMarkerLayerToolProps | undefined) => IMarkerLayerTool
} = {
    getType: () => "geovisto-tool-layer-marker",
    createTool: (props) => new MarkerLayerTool(props),
};

// types
export type { default as IMarkerLayerTool } from './model/types/tool/IMarkerLayerTool';
export type { IMarkerLayerToolConfig, IMarkerLayerToolDimensionsConfig } from './model/types/tool/IMarkerLayerToolConfig';
export type { default as IMarkerLayerToolDefaults } from './model/types/tool/IMarkerLayerToolDefaults';
export type { default as IMarkerLayerToolDimensions } from './model/types/tool/IMarkerLayerToolDimensions';
export type { default as IMarkerLayerToolProps } from './model/types/tool/IMarkerLayerToolProps';
export type { default as IMarkerLayerToolState } from './model/types/tool/IMarkerLayerToolState';

// internal
export { default as MarkerLayerToolSidebarTab } from './model/internal/sidebar/MarkerLayerToolSidebarTab';
export { default as MarkerLayerToolTabDefaults } from './model/internal/sidebar/MarkerLayerToolSidebarTabDefaults';
export { default as MarkerLayerTool } from './model/internal/tool/MarkerLayerTool';
export { default as MarkerLayerToolDefaults } from './model/internal/tool/MarkerLayerToolDefaults';
export { default as MarkerLayerToolState } from './model/internal/tool/MarkerLayerToolState';