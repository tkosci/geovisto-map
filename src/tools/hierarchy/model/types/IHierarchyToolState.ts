import { IMapToolConfig, IMapToolProps, IMapToolState } from "../../../..";
import IHierarchyToolDefaults from "./IHierarchyToolDefaults";

interface IHierarchyToolState<TProps extends IMapToolProps = IMapToolProps,
TDefaults extends IHierarchyToolDefaults = IHierarchyToolDefaults,
TConfig extends IMapToolConfig = IMapToolConfig> extends IMapToolState<TProps, TDefaults, TConfig> {

}
export default IHierarchyToolState;