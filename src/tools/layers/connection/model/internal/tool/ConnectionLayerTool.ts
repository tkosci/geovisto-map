import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as d3 from "d3";
import rfdc from 'rfdc';
import '../../../style/connectionLayer.scss';
import ConnectionLayerToolSidebarTab from '../sidebar/ConnectionLayerToolSidebarTab';
import ConnectionLayerToolState from './ConnectionLayerToolState';
import ConnectionLayerToolDefaults from './ConnectionLayerToolDefaults';
import AbstractLayerTool from '../../../../../../model/internal/layer/AbstractLayerTool';
import DataChangeEvent from '../../../../../../model/internal/event/data/DataChangeEvent';
import SelectionToolEvent from '../../../../../selection/model/internal/event/SelectionToolEvent';
import ThemesToolEvent from '../../../../../themes/model/internal/event/ThemesToolEvent';
import D3PathForceSimulator from '../util/D3PathForceSimulator';
import ProjectionUtil from '../util/ProjectionUtil';
import IConnectionLayerTool from '../../types/tool/IConnectionLayerTool';
import { ISidebarTabControl, ILayerToolSidebarTab } from '../../../../../sidebar';
import { GeovistoSelectionTool, ISelectionTool, IMapSelection } from '../../../../../selection';
import IConnectionLayerToolProps from '../../types/tool/IConnectionLayerToolProps';
import IConnectionLayerToolDefaults from '../../types/tool/IConnectionLayerToolDefaults';
import IConnectionLayerToolState from '../../types/tool/IConnectionLayerToolState';
import IConnectionLayerToolDimensions from '../../types/tool/IConnectionLayerToolDimensions';
import IMapDataDomain from '../../../../../../model/types/data/IMapDataDomain';
import IMapDataManager from '../../../../../../model/types/data/IMapDataManager';
import IMapAggregationFunction from '../../../../../../model/types/aggregation/IMapAggregationFunction';
import CountAggregationFunction from '../../../../../../model/internal/aggregation/basic/CountAggregationFunction';
import IMapAggregationBucket from '../../../../../../model/types/aggregation/IMapAggregationBucket';
import IMapEvent from '../../../../../../model/types/event/IMapEvent';
import IMapChangeEvent from '../../../../../../model/types/event/IMapChangeEvent';
import IMapData from '../../../../../../model/types/data/IMapData';

/**
 * This class represents Connection layer tool. It uses SVG layer and D3 to draw the lines.
 *
 * @author Jiri Hynek
 */
class ConnectionLayerTool extends AbstractLayerTool implements IConnectionLayerTool, ISidebarTabControl {

    private selectionTool: ISelectionTool | undefined;
    private sidebarTab: ILayerToolSidebarTab | undefined;

    /**
     * It creates a new tool with respect to the props.
     *
     * @param props
     */
    public constructor(props: IConnectionLayerToolProps | undefined) {
        super(props);
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
        return new ConnectionLayerToolDefaults(this);
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
     * Help function which acquires and returns the selection tool if available.
     */
    private getSelectionTool(): ISelectionTool | undefined {
        if(this.selectionTool == undefined) {
            const tools = this.getMap()?.getState().getTools().getByType(GeovistoSelectionTool.getType());
            if(tools && tools.length > 0) {
                this.selectionTool = <ISelectionTool> tools[0];
            }
        }
        return this.selectionTool;
    }

    /**
     * It returns a sidebar tab with respect to the configuration.
     */
    public getSidebarTab(): ILayerToolSidebarTab {
        if(this.sidebarTab == undefined) {
            this.sidebarTab = this.createSidebarTabControl();
        }
        return this.sidebarTab;
    }

    /**
     * It creates new tab control.
     */
    protected createSidebarTabControl(): ILayerToolSidebarTab {
        return new ConnectionLayerToolSidebarTab(this, {
            // defined by the sidebar tab defaults
            id: undefined,
            enabled: undefined,
            name: undefined,
            icon: undefined,
            checkButton: undefined
        });
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
        this.processData();

        return [ svgLayer ];
    }

    /**
     * It deletes layer items.
     */
    protected deleteLayerItems(): void {
        const svgLayer = this.getState().getSVGLayer();

        // get layer element
        // TODO: use public API
        if((svgLayer as any)._container != undefined) {
            const layerElement = (svgLayer as any)._container.childNodes[0];
            // delete layer element's children (connections)
            while (layerElement.firstChild) {
                layerElement.removeChild(layerElement.lastChild);
            }
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
    protected processData(): { nodes: Set<string>, connections: Map<string, IMapAggregationBucket> } {
        // initialize a bucket data
        const bucketData = {
            nodes: new Set<string>(),
            connections: new Map<string, IMapAggregationBucket>()
        };

        const map = this.getMap();
        if(map) {
            const leafletMap = map?.getState().getLeafletMap();
            const dimensions: IConnectionLayerToolDimensions = this.getState().getDimensions();
            const fromDimension: IMapDataDomain | undefined = dimensions.from.getDomain();
            const toDimension: IMapDataDomain | undefined = dimensions.to.getDomain();

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
                        foundTos = mapData.getDataRecordValues(fromDimension, data[i]);
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
     * It use the D3 force layout simulation to arrange the connections.
     */
    public postCreateLayerItems(): void {
        const svgLayer = this.getState().getSVGLayer();
        const leafletMap = this.getMap()?.getState().getLeafletMap();

        if(svgLayer && leafletMap) {
            // get overleay pane
            // TODO: use public API
            const overlayPane = d3.select((svgLayer as any)._map.getPanes().overlayPane);

            // get <svg> element (expect L.svg() layer)
            const svg = overlayPane.select("svg");
            const g = svg.select("g")
                // uncoment this in case of non-smooth zoom animation
                //.attr("class", "leaflet-zoom-hide")
            ;
            g.selectAll("*").remove();

            // get bucket data and prepare nodes and connections for 
            const bucketData = this.getState().getBucketData();

            // prepare nodes
            const clone = rfdc();
            const centroids = this.getState().getCentroids();
            const projectPoint = ProjectionUtil.getDataProjectionFunction(leafletMap, this.getDefaults().getProjectionZoom());
            const nodes = new Map<string, unknown>();
            let centroidCopy;
            // TODO specify the type
            for(const centroid of centroids as any) {
                if(bucketData.nodes.has(centroid.id)) {
                    centroidCopy = clone(centroid);
                    projectPoint(centroid);
                    nodes.set(centroid.id, centroidCopy);
                }
            }

            // prepare connections
            // TODO: specify the types
            const connections: { source: any, target: any, value: number }[] = [];
            let geos, source, target;
            for(const [hash, bucket] of bucketData.connections) {
                geos = this.bucketHashToGeoIds(hash);
                source = nodes.get(geos[0]);
                target = nodes.get(geos[1]);
                if(source && target) {
                    connections.push({
                        source: source,
                        target: target,
                        value: bucket.getValue()
                    });
                }
            }

            // create d3 force simulator
            const d3ForceSimulator = new D3PathForceSimulator({
                nodes: nodes,
                connections: connections,
                segmentLength: undefined
            });

            // get projection path function
            // geographic locations [lat, lng] of nodes needs to be projected to leaflet map
            // we use the zoom preferred for the force layout simulation
            const projectionPathFunction = ProjectionUtil.getPathProjectionFunction(leafletMap, this.getDefaults().getProjectionZoom());

            // draw paths
            g.selectAll("path.abc")
                .data(d3ForceSimulator.getPaths())
                .enter()
                .append("path")
                // TODO: use public API
                .attr("d", projectionPathFunction as any)
                //.attr("data-countries", function(d) { return d[0].id + " " + d[d.length-1].id; })
                .attr("class", "leaflet-layer-connection");

            // update paths with respect to actual map state (zoom, move)
            const updatePaths = function() {
                // TODO: use public API
                g.selectAll("path").attr("d", projectionPathFunction as any);
            };

            // highlight connections with respect to the selection of the selection tool if available
            const selection = this.getSelectionTool()?.getState().getSelection();
            if(selection) {
                this.onSelectionUpdate(selection);
            }

            // map move/zoom listener
            leafletMap.on("moveend", updatePaths);
            // initial update
            updatePaths();

            // run force layout algorithm
            d3ForceSimulator.run(
                updatePaths,
                // TODO: specify the type
                function() {
                    // print message when finishes
                    console.log("Force layout algorithm completed!");
                }
            );
        }
    }

    /**
     * It reloads data and redraw the layer.
     */
    public redraw(onlyStyle: boolean): void {
        const svgLayer = this.getState().getSVGLayer();
        // TODO: use public API
        if(svgLayer && (svgLayer as any)._container) {
            // delete actual items
            this.deleteLayerItems();

            // prepare data
            this.processData();

            // update map
            this.postCreateLayerItems();
        }
    }

    /**
     * This function is called when a custom event is invoked.
     *
     * @param event
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == DataChangeEvent.TYPE()) {
            // data change
            this.redraw(false);
        } else if(event.getType() == SelectionToolEvent.TYPE()) {
            // selection change
            this.onSelectionUpdate(<IMapSelection> (<IMapChangeEvent> event).getChangedObject());
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            // theme change
            // TODO
        }
    }

    /**
     * It highlights connections with respect to the given selection.
     */
    protected onSelectionUpdate(selection: IMapSelection): void {
        const svgLayer = this.getState().getSVGLayer();
        // TODO: use public API
        if(svgLayer && (svgLayer as any)._container) {

            // get overleay pane, svg g element and paths
            // TODO: use public API
            const paths = d3.select((svgLayer as any)._map.getPanes().overlayPane)
                            .select("svg")
                            .select("g")
                            .selectAll("path");

            if(selection && selection.getSrcIds().length > 0) {
                const selectionSrcIds = selection.getSrcIds();

                // process all paths and find the affected ones
                let from, to;
                const affectedIds: string[] = [];
                // TODO specify the types
                paths.each(function(d: any) {

                    // from
                    from = d[0].id;
                    to = d[d.length-1].id;
                    if(selectionSrcIds.includes(from)) {
                        // highlight
                        (this as HTMLElement).setAttribute("class", "leaflet-layer-connection-highlight");
                        // check affected country
                        if(!affectedIds.includes(to)) {
                            affectedIds.push(to);
                        }
                    } else if(selectionSrcIds.includes(to)) {
                        // highlight
                        (this as HTMLElement).setAttribute("class", "leaflet-layer-connection-highlight");
                        // check affected country
                        if(!affectedIds.includes(from)) {
                            affectedIds.push(from);
                        }
                    } else {
                        //if(this.getAttribute("class") == "leaflet-layer-connection") {
                            // deemphasize if it is not already highlighted
                            (this as HTMLElement).setAttribute("class", "leaflet-layer-connection-other");
                        //}
                    }
                });

                // update selection with respect to the affected countries
                //console.log("affected", affectedIds);
                if(affectedIds.length > 0) {
                    const selectionTool = this.getSelectionTool();
                    if(selectionTool) {
                        const length = selection.getIds().length;
                        selection.addIds(affectedIds);
                        // check if selection has changed
                        // take only the paths which have not been already processed
                        // this prevents cyclic processing
                        if(length != selection.getIds().length) {
                            selectionTool.setSelection(selection);
                        }
                    }
                }
            } else {
                // set the default path style
                paths.attr("class", "leaflet-layer-connection");
            }
        }
    }
}
export default ConnectionLayerTool;
