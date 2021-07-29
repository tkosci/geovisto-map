// d3
import {
    SimulationNodeDatum
} from "d3-force";

/**
 * This type provides the specification of the connection layer point used for the D3 simulation.
 * 
 * @author Jiri Hynek
 */
type IConnectionLayerPoint = SimulationNodeDatum & {
    x: number,
    y: number
}
export default IConnectionLayerPoint;