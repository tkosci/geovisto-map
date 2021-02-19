import IConnectionLayerPoint from "./IConnectionLayerPoint";

/**
 * This type provides the specification of the connection layer node.
 * 
 * @author Jiri Hynek
 */
 type IConnectionLayerNode = IConnectionLayerPoint & {
    lat: number,
    long: number,
    id: string,
    name: string,
    use: boolean
} 
export default IConnectionLayerNode;