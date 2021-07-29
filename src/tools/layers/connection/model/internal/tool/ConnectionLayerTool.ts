// geojson
import { Point } from 'geojson';

// leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// d3
import { BaseType, select as d3select } from "d3";

// own styles
import '../../../style/connectionLayer.scss';

// Geovisto core
import {
    AbstractLayerTool,
    CountAggregationFunction,
    DataChangeEvent,
    DataManagerChangeEvent,
    GeoJSONTypes ,
    IDataChangeAnimateOptions,
    IMapAggregationBucket,
    IMapAggregationFunction,
    IMapData,
    IMapDataChangeEvent,
    IMapDataDomain,
    IMapDataManager,
    IMapDimension,
    IMapEvent,
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    LayerToolRenderType
} from '../../../../../../index.core';

import ConnectionLayerToolMapForm from '../form/ConnectionLayerToolMapForm';
import ConnectionLayerToolState from './ConnectionLayerToolState';
import ConnectionLayerToolDefaults from './ConnectionLayerToolDefaults';
import AnimateDirectionUtil from '../util/AnimateDirectionUtil';
import D3PathForceSimulator from '../util/D3PathForceSimulator';
import IConnectionLayerConnection from '../../types/items/IConnectionLayerConnection';
import IConnectionLayerNode from '../../types/items/IConnectionLayerNode';
import IConnectionLayerPath from '../../types/items/IConnectionLayerPath';
import IConnectionLayerTool from '../../types/tool/IConnectionLayerTool';
import { IConnectionLayerToolConfig } from '../../types/tool/IConnectionLayerToolConfig';
import IConnectionLayerToolDimensions from '../../types/tool/IConnectionLayerToolDimensions';
import IConnectionLayerToolDefaults from '../../types/tool/IConnectionLayerToolDefaults';
import IConnectionLayerToolProps from '../../types/tool/IConnectionLayerToolProps';
import IConnectionLayerToolState from '../../types/tool/IConnectionLayerToolState';
import ProjectionUtil from '../util/ProjectionUtil';
import SelectionChangeAdapter from '../adapters/SelectionChangeAdapter';
import ThemeChangeAdapter from '../adapters/ThemeChangeAdapter';

/**
 * This class represents Connection layer tool. It uses SVG layer and D3 to draw the lines.
 *
 * @author Jiri Hynek
 */
class ConnectionLayerTool extends AbstractLayerTool implements IConnectionLayerTool, IMapFormControl {

    private mapForm!: IMapForm;
    
    private selectionChangeAdapter!: SelectionChangeAdapter;
    private themeChangeAdapter!: ThemeChangeAdapter;
    private animateDirectionUtil!: AnimateDirectionUtil;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private connectionsPaths!: Record<string, d3.Selection<BaseType, any, any, any>>;

    /**
     * It creates a new tool with respect to the props.
     *
     * @param props
     */
    public constructor(props?: IConnectionLayerToolProps) {
        super(props);

        this.connectionsPaths = {};
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IConnectionLayerTool {
        return new ConnectionLayerTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IConnectionLayerToolProps {
        return <IConnectionLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IConnectionLayerToolDefaults {
        return <IConnectionLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IConnectionLayerToolDefaults {
        return new ConnectionLayerToolDefaults();
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): IConnectionLayerToolState {
        return <IConnectionLayerToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): IConnectionLayerToolState {
        return new ConnectionLayerToolState(this);
    }

    /**
     * It returns selection change adapter.
     */
     protected getSelectionChangeAdapter(): SelectionChangeAdapter {
        if(!this.selectionChangeAdapter) {
            this.selectionChangeAdapter = new SelectionChangeAdapter(this);
        }
        return this.selectionChangeAdapter;
    }

    /**
     * It returns theme change adapter.
     */
     protected getThemeChangeAdapter(): ThemeChangeAdapter {
        if(!this.themeChangeAdapter) {
            this.themeChangeAdapter = new ThemeChangeAdapter(this);
        }
        return this.themeChangeAdapter;
    }

    /**
     * It returns theme change adapter.
     */
     protected getAnimateDirectionUtil(): AnimateDirectionUtil {
        if(!this.animateDirectionUtil) {
            this.animateDirectionUtil = new AnimateDirectionUtil(this);
        }
        return this.animateDirectionUtil;
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getMapForm(): IMapForm {
        if(this.mapForm == undefined) {
            this.mapForm = this.createMapForm();
        }
        return this.mapForm;
    }

    /**
     * It creates new tab control.
     */
    protected createMapForm(): IMapForm {
        return new ConnectionLayerToolMapForm(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IConnectionLayerToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates layer items.
     */
    protected createLayerItems(): L.Layer[] {
        // create Leaflet SVG layer
        const svgLayer: L.SVG = L.svg();

        // update state
        this.getState().setSVGLayer(svgLayer);

        // prepare data
        this.updateData();

        return [ svgLayer ];
    }

    /**
     * It deletes layer items.
     */
    protected deleteLayerItems(): void {
        const overlayPane = this.getState().getSVGLayer()?.getPane();

        // remove SVG paths
        if(overlayPane) {
            d3select(overlayPane).select("svg").select("g").selectAll("path").remove();
        }
    }

    /**
     * It returns the hash of (from, to) used in data buckets.
     * 
     * @param from 
     * @param to 
     */
    protected geoIdsToBucketHash(from: string, to: string): string {
        return from + "\t" + to;
    }

    /**
     * It returns the the geo ids (from, to) used in data bucket hash.
     * 
     * @param bucketHash 
     */
    protected bucketHashToGeoIds(bucketHash: string): string[] {
        return bucketHash.split('\t');
    }

    /**
     * It prepares data for connections.
     */
    protected updateData(): { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> } {
        // initialize a bucket data
        const bucketData = {
            nodes: new Set<string>(),
            connections: new Map<string, IMapAggregationBucket>()
        };

        const map = this.getMap();
        if(map) {
            const leafletMap = map?.getState().getLeafletMap();
            const dimensions: IConnectionLayerToolDimensions = this.getState().getDimensions();
            const fromDimension: IMapDataDomain | undefined = dimensions.from.getValue();
            const toDimension: IMapDataDomain | undefined = dimensions.to.getValue();

            // TODO: implement aggregation of values
            const aggregationDimension: IMapAggregationFunction = new CountAggregationFunction();

            // test whether the dimension are set
            if(leafletMap && fromDimension && toDimension) {
                const mapData: IMapDataManager = map.getState().getMapData();
                const data: IMapData = map.getState().getCurrentData();
                const dataLen: number = data.length;
                let foundFroms: unknown[], foundTos: unknown[];
                const value = 1; // TODO: fetch the value from data
                let bucketHash;

                let aggregationBucket: IMapAggregationBucket | undefined;
                for (let i = 0; i < dataLen; i++) {
                    // find the 'from' properties of the data record
                    foundFroms = mapData.getDataRecordValues(fromDimension, data[i]);
                    // since the data are flattened we can expect max one found item
                    if(foundFroms.length == 1 && typeof foundFroms[0] === "string") {
                        // find the 'to' properties of the data record
                        foundTos = mapData.getDataRecordValues(toDimension, data[i]);
                        // since the data are flattened we can expect max one found item
                        if(foundTos.length == 1 && typeof foundTos[0] === "string") {
                            // update the node set
                            // TODO: country identifiers should be always string
                            bucketData.nodes.add(foundFroms[0]);
                            bucketData.nodes.add(foundTos[0]);
                            // update the bucket map
                            bucketHash = this.geoIdsToBucketHash(foundFroms[0], foundTos[0]);
                            aggregationBucket = bucketData.connections.get(bucketHash);
                            if(!aggregationBucket) {
                                aggregationBucket = aggregationDimension.getAggregationBucket();
                                bucketData.connections.set(bucketHash, aggregationBucket);
                            }
                            // find the 'value' properties (TODO: provide support)
                            //foundValues = mapData.getDataRecordValues(valueDimension, data[i]);
                            // since the data are flattened we can expect max one found item
                            aggregationBucket.addValue(value);
                        }
                    }
                }    
            }

            // update work data
            this.getState().setBucketData(bucketData);
        }

        return bucketData;
    }

    /**
     * This function is called when layer items are rendered.
     * It uses the D3 force layout simulation to arrange the connections.
     */
    protected renderConnections(animateOptions: IDataChangeAnimateOptions = { transitionDelay: 0, transitionDuration: 0 }): void {
        const leafletMap = this.getMap()?.getState().getLeafletMap();
        const overlayPane = this.getState().getSVGLayer()?.getPane();

        if(leafletMap && overlayPane) {

            // get bucket data and prepare nodes and connections for 
            const bucketData = this.getState().getBucketData();

            // prepare nodes
            const pointFeatures = this.getState().getDimensions().geoData.getValue()?.getFeatures([ GeoJSONTypes.Point ]);
            const projectPoint = ProjectionUtil.getDataProjectionFunction(leafletMap, this.getDefaults().getProjectionZoom());
            const usedNodes = new Map<string, IConnectionLayerNode>();
            let node: IConnectionLayerNode;
            if(pointFeatures) {
                for(const pointFeature of pointFeatures.features) {
                    if(pointFeature.id && bucketData.nodes.has(pointFeature.id.toString())) {
                        node = {
                            lat: (pointFeature.geometry as Point).coordinates[0],
                            long: (pointFeature.geometry as Point).coordinates[1],
                            id: pointFeature.id.toString(),
                            name: pointFeature.id.toString(),
                            x: 0,
                            y: 0,
                            use: false
                        };
                        projectPoint(node);
                        usedNodes.set(node.id, node);
                    }
                }
    
                // prepare connections
                const connections: IConnectionLayerConnection[] = [];
                let geoIds: string[], source: IConnectionLayerNode | undefined, target: IConnectionLayerNode | undefined;
                for(const [hash, bucket] of bucketData.connections) {
                    geoIds = this.bucketHashToGeoIds(hash);
                    source = usedNodes.get(geoIds[0]);
                    target = usedNodes.get(geoIds[1]);
                    if(source && target) {
                        connections.push({
                            source: source,
                            target: target,
                            value: bucket.getValue()
                        });
                        source.use = true;
                        target.use = true;
                    }
                }
    
                // filter unused nodes
                const nodes: IConnectionLayerNode[] = [];
                for(const [ , node ] of usedNodes) {
                    if(node.use) {
                        nodes.push(node);
                    }
                }
    
                // create d3 force simulator
                const d3ForceSimulator = new D3PathForceSimulator({
                    nodes: nodes,
                    connections: connections,
                    segmentLength: undefined
                });
    
                //console.log(nodes, connections);
    
                // get projection path function
                // geographic locations [lat, lng] of nodes needs to be projected to leaflet map
                // we use the zoom preferred for the force layout simulation
                const projectionPathFunction = ProjectionUtil.getPathProjectionFunction(leafletMap, this.getDefaults().getProjectionZoom());

                // get <svg> element (expect L.svg() layer)
                const g = d3select(overlayPane).select("svg").select("g")
                // uncoment this in case of non-smooth zoom animation
                //.attr("class", "leaflet-zoom-hide")
                ;
                g.selectAll("*").remove();

                // get new paths map from the d3 simulator
                const pathsMap: Record<string, IConnectionLayerPath []> = d3ForceSimulator.getPathsMap();

                // construct array of new and old connection ids
                const connectionsIds: string[] = [
                    ...Object.keys(this.connectionsPaths),
                    ...Object.keys(pathsMap)
                ];
                
                // construct new map (id, paths) using all ids (we can recognize deprecated ids)
                const pathsData = connectionsIds.reduce((acc: Record<string, IConnectionLayerPath[]>, connectionId: string) => ({
                    ...acc,
                    [connectionId]: pathsMap[connectionId] || [],
                }), {});

                //console.log("all paths data", pathsData);
                
                // draw paths
                Object.entries(pathsData).forEach(([id, paths]: [ string, IConnectionLayerPath[]]) => {

                    //console.log("ahoj", paths);
                    
                    // the type does not match!
                    this.connectionsPaths[id] = g
                        .selectAll(`path.leaflet-layer-connection.${id}`)
                        .data(paths);
                    
                    this.connectionsPaths[id].enter()
                        .append("path")
                        .attr("d", "projectionPathFunction")
                        .attr("class", `leaflet-layer-connection ${id}`)
                        .style("stroke-opacity", 0)
                        .transition()
                        .delay(animateOptions.transitionDelay)
                        .duration(animateOptions.transitionDuration)
                        .style("stroke-opacity", 0.4);
                    
                    this.connectionsPaths[id].exit()
                        .transition()
                        .delay(animateOptions.transitionDelay)
                        .duration(animateOptions.transitionDuration)
                        .style("stroke-opacity", 0)
                        .remove();
                });
                
                // old simple soultion
                /*const paths = d3ForceSimulator.getPaths();
                console.log(pathsMap, paths);
    
                    // draw paths
                    g.selectAll("path.abc")
                    .data(d3ForceSimulator.getPaths())
                    .enter()
                    .append("path")
                    // TODO: use public API (keep any for this purpose)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .attr("d", projectionPathFunction as any)
                    //.attr("data-countries", function(d) { return d[0].id + " " + d[d.length-1].id; })
                    .attr("class", "leaflet-layer-connection");
                */
    
                // update paths with respect to actual map state (zoom, move)
                const updatePaths = function() {
                    // TODO: use public API (keep any for this purpose)
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    g.selectAll("path").attr("d", projectionPathFunction as any);
                };
    
                // map move/zoom listener
                leafletMap.on("moveend", updatePaths);
                // initial update
                updatePaths();
    
                // run force layout algorithm
                const run = () => {
                    d3ForceSimulator.run(
                        updatePaths,
                        function() {
                            // print message when finishes
                            console.log("Force layout algorithm completed!");
                        }
                    );
                };

                if(animateOptions && animateOptions.transitionDelay > 0) {
                    setTimeout(run, animateOptions.transitionDelay);
                } else {
                    run();
                }
            }
        }
    }

    /**
     * Help method which updates styles
     */
    protected updateStyle(): void {
        this.getAnimateDirectionUtil().animateDirection(this.getState().getDimensions().direction.getValue() ?? false);

        // highlight connections with respect to the selection of the selection tool if available
        this.getSelectionChangeAdapter().updateSelection();
    }

    /**
     * It reloads data and redraw the layer.
     * 
     * @param type
     */
    public render(type: number, animateOptions?: IDataChangeAnimateOptions): void {
        const svgLayer: L.SVG | undefined = this.getState().getSVGLayer();
        if(svgLayer && (svgLayer.getPane())) {
            switch (type) {
                case LayerToolRenderType.LAYER:
                case LayerToolRenderType.DATA:
                    if(!animateOptions) {
                        this.deleteLayerItems();
                    }
                    this.updateData();
                    this.renderConnections();
                    this.updateStyle();
                    break;
                default:
                    this.updateStyle();
                    break;
            }
        }
    }

    /**
     * It updates the dimension.
     * 
     * @param dimension 
     * @param value 
     * @param renderType 
     */
    public updateDimension(dimension: IMapDimension<unknown>, value: string, renderType: number | undefined): void {
        if(!renderType) {
            const dimensions : IConnectionLayerToolDimensions = this.getState().getDimensions();
            switch (dimension) {
                case dimensions.geoData:
                    renderType = LayerToolRenderType.LAYER;
                    break;
                case dimensions.from:
                case dimensions.to:
                    renderType = LayerToolRenderType.DATA;
                    break;
                case dimensions.direction:
                default:
                    renderType = LayerToolRenderType.STYLE;
                    break;
            }
        }
        super.updateDimension(dimension, value, renderType);
    }

    /**
     * This function is called when a custom event is invoked.
     *
     * @param event
     */
    public handleEvent(event: IMapEvent): void {
        switch (event.getType()) {
            case DataManagerChangeEvent.TYPE():
                this.render(LayerToolRenderType.DATA);
                break;
            case DataChangeEvent.TYPE():
                this.render(LayerToolRenderType.DATA, (<IMapDataChangeEvent> event).getAnimateOptions());
                break;
            default:
                this.getSelectionChangeAdapter().handleEvent(event);
                this.getThemeChangeAdapter().handleEvent(event);
                break;
        }
    }
}
export default ConnectionLayerTool;
