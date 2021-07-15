// d3
import {
    select as d3select
} from "d3";

import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";

/**
 * Help class which provide animating of direction in connections.
 * 
 * @author Krystof Rykala
 * @author Jiri Hynek - converted to Typescript and moved to util class
 */
class AnimateDirectionUtil {

    private tool: IConnectionLayerTool;
    private animationInterval!: NodeJS.Timeout | null;

    public constructor(tool: IConnectionLayerTool) {
        this.tool = tool;
    }

    /**
     * It changes the styles of connection (enables/disables animation).
     * 
     * @param animate 
     */
    public animateDirection(animate: boolean): void {
        const overlayPane = this.tool.getState().getSVGLayer()?.getPane();

        if(overlayPane) {
            // get <svg> element (expect L.svg() layer)
            const layerSvg = d3select(overlayPane).select("svg");
            const connections = layerSvg.selectAll("path.leaflet-layer-connection");
            if(animate) {
                this.animationInterval && clearInterval(this.animationInterval);
                let offset = 0;
                connections.style("stroke-dasharray", "10,4");
                this.animationInterval = setInterval(() => {
                    connections.style("stroke-dashoffset", offset);
                    offset += 1;
                }, 100);
            }
            if(!animate && this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
                connections.style("stroke-dasharray", "none");
            }
        }
    }
}
export default AnimateDirectionUtil;