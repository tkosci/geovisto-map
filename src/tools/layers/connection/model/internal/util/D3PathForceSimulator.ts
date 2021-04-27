import * as d3 from "d3";

interface SimulationProps {
    charge: {
        strength: number,
        distanceMin: number,
        distanceMax: number
    };
    link: {
        strength: number,
        distance: number
    };
    // how quickly it gets to the alpha (stops the simulation)
    alphaDecay: number;
}

/**
 * This class represents the force layout simulator powered by the d3-force library.
 * It takes the nodes and connections and prepares the list paths
 * which can be bent by the D3 force simulation.
 * 
 * A former idea to split the lines into line segments and use the D3 force simulation can be found
 * in the prototype writen by S. Engle (https://gist.github.com/ericfischer/dafc36a3d212da4619dde2d392553c7a)
 * demonstarting force‐directed edge bundling for graph visualization (by Danny Holten and Jarke J. van Wijk).
 * Further ideas were found in the D3 docs and examples.
 * 
 * Our approach implements a very simple segmentation of the connections
 * which works with the constant maximal length of segments.
 * This causes that short connections won't be segmented,
 * which improves the performance of the simulation.
 * The preferred maximal length of the line segments can be adjusted using props.
 * 
 * @author Jiri Hynek
 */
class D3PathForceSimulator {
    
    /**
     * TODO: specify the types.
     */
    private props: { nodes: Map<string, any>; connections: { source: any, target: any, value: number }[]; segmentLength: number | undefined; };
    private paths: any;
    private forceProps: SimulationProps | undefined;
    private nodes: any;
    private links: any;
    private segmentLength: number;

    /**
     * It initializes the object by setting the props.
     */
    public constructor(props: { nodes: Map<string, any>, connections: { source: any, target: any, value: number }[], segmentLength: number | undefined } ){
        this.props = props;

        // maximum number of path items
        this.segmentLength = (props.segmentLength && props.segmentLength > 0 ? props.segmentLength : this.getDefaultSegmentLength());
    }
    
    /**
     * It returns default size of the segment
     */
    protected getDefaultSegmentLength(): number {
        return 50;
    }

    /**
     * It returns the paths.
     * 
     * TODO: specify the types
     */
    public getPaths(): any {
        if(this.paths == undefined) {
            this.paths = this.createPaths();
        }
        return this.paths;
    }

    /**
     * It creates paths (split connections into segments).
     * 
     * TODO: specify the types
     */
    protected createPaths(): any {
        const paths = [];

        // go through all map connections and create paths for every connection
        // connections represented by a path can be bent
        for(let i = 0; i < this.props.connections.length; i++) {
            paths.push(this.createPath(this.props.connections[i]));
        }

        return paths;
    }

    /**
     * Help function which takes a connection and split the connection into segments.
     * The number of segments is based on the preferred maximal length of segment.
     * 
     * TODO: specify the types
     * 
     * @param connection 
     */
    protected createPath(connection: any): any {
        const path: any = [];

        // get connection's nodes
        const source = connection.source;
        const target = connection.target;

        // add the first point 
        path.push(source);

        // length of the connection: sqrt((x2-x1)^2 + (y2-y1)^2)
        const length = Math.sqrt((target.x - source.x) * (target.x - source.x)
                                 + (target.y - source.y) * (target.y - source.y));
        
        // preferred number of segments
        const numberOfSegments = Math.round(length/this.segmentLength);

        // add points
        if(numberOfSegments > 1) {
            // calculate distance between the points
            const dx = (target.x - source.x) / numberOfSegments;
            const dy = (target.y - source.y) / numberOfSegments;

            // add the middle points
            const numberOfPoints = numberOfSegments-1;
            let point = source;
            for (let i = 0; i <= numberOfPoints; i++) {
                point = {
                    x: point.x + dx,
                    y: point.y + dy
                };
                // add a middle point
                path.push(point);
            }
        }

        // add the last point
        path.push(target);

        return path;
    }

    /**
     * It creates creates and runs the D3 force layout simulation.
     * 
     * @param onTickAction
     * @param onEndAction
     */
    public run(onTickAction: () => void, onEndAction: () => void): void {
        // get D3 force layout simulator
        const simulation = this.getSimulation();
        
        // set run properties to run the simulation
        simulation
            .on("tick", onTickAction)
            .on("end", onEndAction);
    }

    /**
     * It returns the definition of D3 force simulation.
     */
    protected getSimulation(): d3.Simulation<d3.SimulationNodeDatum, undefined> {
        // usage of D3 force layout simulation
        const props = this.getForceProps();
        // TODO use dynamic props based on current situation

        return d3.forceSimulation(this.getNodes())
            .force("charge", d3.forceManyBody()
                .strength(props.charge.strength)
                .distanceMin(props.charge.distanceMin)
                .distanceMax(props.charge.distanceMax)
            )
            .force("link", d3.forceLink()
                .links(this.getLinks())
                .strength(props.link.strength)
                .distance(props.link.distance)
            )
            .alphaDecay(props.alphaDecay);
    }

    /**
     * It returns the D3 force simulation props.
     */
    protected getForceProps(): SimulationProps {
        if(this.forceProps == undefined) {
            this.forceProps = this.createDefaultForceProps();
        }
        return this.forceProps;
    }

    /**
     * It returns the default D3 force simulation props.
     */
    protected createDefaultForceProps(): SimulationProps {
        return {
            charge: {
                strength: 12,
                distanceMin: 25,
                distanceMax: 50
            },
            link: {
                strength: 0.8,
                distance: 0
            },
            // how quickly it gets to the alpha (stops the simulation)
            alphaDecay: 0.15
        };
    }

    /**
     * It returns the nodes for D3 force layout simulator.
     * 
     * TODO: specify the types
     */
    protected getNodes(): any {
        if(this.nodes == undefined) {
            this.nodes = this.createNodes();
        }
        return this.nodes;
    }

    /**
     * It prepares the nodes for D3 force layout simulator.
     * 
     * TODO: specify the types
     */
    protected createNodes(): any {
        const nodes = [];

        // go through all end nodes add them to the list
        const endNodes = this.props.nodes;
        let node;
        for(const node of endNodes) {
            // setting the fx, fy fixed position
            // -> these nodes should not be moved by the D3 force simulation
            (node as any).fx = (node as any).x;
            (node as any).fy = (node as any).y;

            nodes.push(node);
        }
        
        // go throught all paths and add the remaining points between the end nodes
        const paths = this.getPaths();
        let path;
        for(let i = 0; i < paths.length; i++) {
            path = paths[i];
            // go through the middle points
            // the first and the last points have already been added
            for(let j = 1; j < path.length-1; j++) {
                nodes.push(path[j]);
            }
        }
        return nodes;
    }

    /**
     * It returns the links for D3 force layout simulator.
     * 
     * TODO: specify the types
     */
    protected getLinks(): any {
        if(this.links == undefined) {
            this.links = this.createLinks();
        }
        return this.links;
    }

    /**
     * It creates the links for D3 force layout simulator.
     * 
     * TODO: specify the types
     */
    protected createLinks(): any {
        const links = [];

        // go throught all paths and contruct links
        const paths = this.getPaths();
        let path;
        for(let i = 0; i < paths.length; i++) {
            path = paths[i];
            // path is represented by the list of path points
            for(let j = 1; j < path.length; j++) {
                links.push({
                    source: path[j-1],
                    target: path[j]
                });
            }
        }

        return links;
    }
}
export default D3PathForceSimulator;