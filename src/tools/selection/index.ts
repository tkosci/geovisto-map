import { MapSelection } from '.';
import IMapTool from '../../model/types/tool/IMapTool';
import { IMapSelection, ISelectionTool, SelectionTool, ISelectionToolProps } from '..';

export const GeovistoSelectionTool: {
    getType: () => string,
    createTool: (props: ISelectionToolProps | undefined) => ISelectionTool
    createSelection: (source: IMapTool, ids: string[]) => IMapSelection
} = {
    getType: () => "geovisto-tool-selection",
    createTool: (props) => new SelectionTool(props),
    createSelection: (source, ids) => new MapSelection(source, ids)
};

// types
export type { default as ISelectionToolEvent } from './model/types/event/ISelectionToolEvent';
export type { default as IMapSelection } from './model/types/selection/IMapSelection';
export type { default as ISelectionTool } from './model/types/tool/ISelectionTool';
export type { default as ISelectionToolConfig } from './model/types/tool/ISelectionToolConfig';
export type { default as ISelectionToolDefaults } from './model/types/tool/ISelectionToolDefaults';
export type { default as ISelectionToolProps } from './model/types/tool/ISelectionToolProps';
export type { default as ISelectionToolState } from './model/types/tool/ISelectionToolState';

// internal
export { default as SelectionToolEvent } from './model/internal/event/SelectionToolEvent';
export { default as MapSelection } from './model/internal/selection/MapSelection';
export { default as SelectionToolTabFragment } from './model/internal/sidebar/SelectionToolTabFragment';
export { default as SelectionTool } from './model/internal/tool/SelectionTool';
export { default as SelectionToolDefaults } from './model/internal/tool/SelectionToolDefaults';
export { default as SelectionToolState } from './model/internal/tool/SelectionToolState';