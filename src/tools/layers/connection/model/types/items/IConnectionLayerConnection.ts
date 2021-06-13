import IConnectionLayerNode from "./IConnectionLayerNode";

/**
 * This type provides the specification of the connection layer point.
 * 
 * @author Jiri Hynek
 */
 type IConnectionLayerConnection = {
    source: IConnectionLayerNode,
    target: IConnectionLayerNode,
    value: number
}
export default IConnectionLayerConnection;