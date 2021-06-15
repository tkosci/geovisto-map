import ILayerToolProps from "../../../../../../model/types/layer/ILayerToolProps";

/**
 * This type provides the specification of the tiles layer tool props model.
 * 
 * @author Jiri Hynek
 */
type ITilesLayerToolProps = ILayerToolProps & {
    baseMap?: string;
}
export default ITilesLayerToolProps;