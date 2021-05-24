import L, { marker, MarkerClusterGroup } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '../../../style/markerLayer.scss'; 
import * as d3 from "d3";
import MarkerLayerToolSidebarTab from '../sidebar/MarkerLayerToolSidebarTab';
import MarkerLayerToolDefaults from './MarkerLayerToolDefaults';
import MarkerLayerToolState from './MarkerLayerToolState';
import AbstractLayerTool from '../../../../../../model/internal/layer/AbstractLayerTool';
import ThemesToolEvent from '../../../../../themes/model/internal/event/ThemesToolEvent';
import SelectionToolEvent from '../../../../../selection/model/internal/event/SelectionToolEvent';
import DataChangeEvent from '../../../../../../model/internal/event/data/DataChangeEvent';
import IMarkerLayerTool from '../../types/tool/IMarkerLayerTool';
import { ISidebarTabControl, ILayerToolSidebarTab } from '../../../../../sidebar';
import IMarkerLayerToolProps from '../../types/tool/IMarkerLayerToolProps';
import IMarkerLayerToolDefaults from '../../types/tool/IMarkerLayerToolDefaults';
import IMarkerLayerToolState from '../../types/tool/IMarkerLayerToolState';
import { GeovistoSelectionTool, ISelectionTool } from '../../../../../selection';
import IMarkerLayerToolDimensions from '../../types/tool/IMarkerLayerToolDimensions';
import IMapDataDomain from '../../../../../../model/types/data/IMapDataDomain';
import IMapAggregationFunction from '../../../../../../model/types/aggregation/IMapAggregationFunction';
import IMapDataManager from '../../../../../../model/types/data/IMapDataManager';
import IMapAggregationBucket from '../../../../../../model/types/aggregation/IMapAggregationBucket';
import IMapEvent from '../../../../../../model/types/event/IMapEvent';
import IMapData from '../../../../../../model/types/data/IMapData';

/**
 * This class represents custom div icon which is used to mark center of countries.
 * It overrides L.DivIcon.
 * 
 * TODO: specify the types
 * 
 * @author Jiri Hynek
 * @override {L.DivIcon}
 */
const MarkerIcon = L.DivIcon.extend({

    _LEVEL: 0,
    _SUFFIX: 1,
    _COLOR: 2,
    levels: [
        [-Infinity, "N/A", "#CCCCCC"],
        [1, "", "#CCCCCC"],
        [1e2, "K", "#AAAAAA"],
        [1e5, "M", "#555555"],
        [1e8, "B", "#222222"],
        [1e11, "t", "#111111"],
    ],

    // moved to css
    //donutColors: ["darkred", "goldenrod", "gray"],

    options: {
        sizeBasic: 32,
        sizeGroup: 36,
        sizeDonut: 48,

        // It is derived
        //iconSize: [32,32],
        //iconAnchor: [32/2,32/2],

        className: "div-country-icon",
        values: {
            id: "",
            value: 0,
            subvalues: {
            }
        },
        isGroup: false,
        useDonut: true
    },

    round: function(value: number, align: number): number {
        return Math.round(value*align)/align;
    },

    formatValue: function(value: number, level: number): string {
        if(level == undefined || level < 0) {
            return this.levels[0][this._SUFFIX];
        } else {
            if(this.levels[level][this._LEVEL] == -Infinity) {
                return this.levels[level][this._SUFFIX];
            } else if(this.levels[level][this._LEVEL] == 1) {
                return this.round(value, this.levels[level][this._LEVEL]);
            } else {
                value = value/(this.levels[level][this._LEVEL]*10);
                const align = (value >= 10) ? 1 : 10;
                return this.round(value, align) + this.levels[level][this._SUFFIX];
            }
        }
    },

    getColor: function(level: number): string {
        if(level == null || level < 0) {
            return this.levels[0][this._COLOR];
        } else {
            return this.levels[level][this._COLOR];
        }
    },

    getLevel: function(value: number): number {
        for(let i = this.levels.length-1; i >= 0; i--) {
            if(value > this.levels[i][this._LEVEL]) {
                return i;
            }
        }
        return -1;
    },

    /**
     * TODO specify the types
     * 
     * @param oldIcon 
     */
    createIcon: function (oldIcon: any): any {
        const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        const size = options.useDonut ? options.sizeDonut : (options.isGroup ? options.sizeGroup : options.sizeBasic);
        options.iconSize = [size,size];
        options.iconAnchor = [size/2,size/2];
        const rCircle = options.sizeBasic/2;
        const center = size/2;
        // moved to css
        //var strokeWidth = options.isGroup ? ((options.sizeGroup-options.sizeBasic)/2) : 0;
        const level = this.getLevel(options.values.value);

        const divContent = div.appendChild(document.createElement('div'));
        divContent.classList.value = 
            "leaflet-marker-level" + level // level
            + (options.isGroup ? " leaflet-marker-group" : "") // group of several markers
        ;


        //console.log(size);
        const element = d3.select(divContent);
        //console.log(element)
        const svg = element.append("svg");
        svg.attr("width", size).attr("height", size);
        //svg.classList.add("leaflet-marker-item");

        // circle
        svg.append("circle")
            .attr("cx", center)
            .attr("cy", center)
            .attr("r", rCircle);
            // moved to css
            //.attr("fill", this.getColor(level))
            //.attr("fill-opacity", 0.9)
            //.attr("stroke-width", strokeWidth)
            //.attr("stroke", "black");

        // value label
        svg.append("text")
            .html(this.formatValue(options.values.value, level))
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("dy", "0.3em")
            .attr("font-family", "Arial");
            // moved to css
            //.attr("fill", "white")

        if(options.values.value != null && options.values.value != 0) {
        //var values = { a: 0.5, b: 0.3, c: 0.2 };
        // moved to css
        //var color = d3.scaleOrdinal()
        //    .domain(options.values.subvalues)
        //    .range(this.donutColors);
        // TODO specify the types
        const pie = d3.pie().value(function(d) { return (d as any)[1]; });
        const values_ready = pie(options.values.subvalues as any);
        // donut chart
        svg.append("g")
            .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")
            .selectAll("abc")
            .data(values_ready)
            .enter()
            .append("path")
            .attr("d", d3.arc()
                .innerRadius(size/4+6)
                .outerRadius(size/2) as any
            )
            // moved to css
            .attr('class', function(d, i) { return "leaflet-marker-donut" + (i % 3 + 1); })
            //.attr('fill', function(d) { return(color(d.data.key)) })
            //.attr("stroke-width", "0px")
            //.attr("opacity", 0.8)
            ;
        }

        /*const icon = <svg width={size} height={size}>
            <circle cx={center} cy={center} r={rCircle} fill={this.getColor(level)} fillOpacity="0.8" strokeWidth={strokeWidth} stroke="black" />
            <text x="50%" y="50%" textAnchor="middle" fill="white"
                fontSize="12px" dy="0.3em" fontFamily="Arial">{this.formatValue(options.countryValue, level)}</text>
        </svg>;
        //div.innerHTML = "<b>1</b>";
        ReactDOM.render(icon, divContent);*/

        if (options.bgPos) {
            const bgPos = L.point(options.bgPos);
            div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
        }
        this._setIconStyles(div, 'icon');

        return div;
    },
});

/**
 * This class represents Marker layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerTool extends AbstractLayerTool implements IMarkerLayerTool, ISidebarTabControl {

    private selectionTool: ISelectionTool | undefined;
    private sidebarTab: ILayerToolSidebarTab | undefined;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props: IMarkerLayerToolProps | undefined) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IMarkerLayerTool {
        return new MarkerLayerTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IMarkerLayerToolProps {
        return <IMarkerLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IMarkerLayerToolDefaults {
        return <IMarkerLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IMarkerLayerToolDefaults {
        return new MarkerLayerToolDefaults(this);
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): IMarkerLayerToolState {
        return <IMarkerLayerToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): IMarkerLayerToolState {
        return new MarkerLayerToolState(this);
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
        return new MarkerLayerToolSidebarTab(this, {
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
        // create layer which clusters points
        //let layer = L.layerGroup([]);
        const markerLayerGroup: MarkerClusterGroup = L.markerClusterGroup({

            // create cluster icon
            iconCreateFunction: function (cluster) {
                const markers: L.Marker[] = cluster.getAllChildMarkers();
                const data = { id: "<Group>", value: 0, subvalues: {} };
                for (let i = 0; i < markers.length; i++) {
                    // TODO specify the types
                    data.value += (markers[i].options.icon as any)?.options.values.value;
                    for(const [key, value] of Object.entries((markers[i].options.icon as any)?.options.values.subvalues)) {
                        if((data.subvalues as any)[key] == undefined) {
                            (data.subvalues as any)[key] = value;
                        } else {
                            (data.subvalues as any)[key] += value;
                        }
                    }
                }
                // create custom icon
                const icon = new MarkerIcon();
                icon.countryName = "<Group>";
                icon.values = data;
                icon.isGroup = true;
                return icon;
            }
        });

        // update state
        this.getState().setMarkerLayerGroup(markerLayerGroup);

        this.redraw(false);

        return [ markerLayerGroup ];
    }

    /**
     * It deletes layer items.
     */
    protected deleteLayerItems(): void {
        //console.log("marker");
        const markers = this.getState().getMarkers();

        // delete the 'value' property of every geo feature object if defined
        const markerLayerGroup = this.getState().getMarkerLayerGroup();
        if(markerLayerGroup) {
            for(let i = 0; i < markers.length; i++) {
                markerLayerGroup.removeLayer(markers[i]);
            }
        }
        
        this.getState().setMarkers([]);
    }

    /**
     * It prepares data for markers.
     */
    protected processData(): Map<string, Map<string, IMapAggregationBucket>> {
        // initialize a hash map of aggreation buckets
        const bucketMaps = new Map<string, Map<string, IMapAggregationBucket>>();

        // get dimensions
        const dimensions: IMarkerLayerToolDimensions = this.getState().getDimensions();
        const geoDimension: IMapDataDomain | undefined = dimensions.geo.getDomain();
        const valueDimension: IMapDataDomain | undefined = dimensions.value.getDomain();
        const aggregationDimension: IMapAggregationFunction | undefined = dimensions.aggregation.getDomain();
        const categoryDimension: IMapDataDomain | undefined = dimensions.category.getDomain();
        const map = this.getMap();

        // test whether the dimension are set
        if(geoDimension && valueDimension && aggregationDimension && categoryDimension && map) {
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;
            let foundGeos: unknown[], foundValues: unknown[], foundCategories: unknown[];
            
            let bucketMap: Map<string, IMapAggregationBucket> | undefined;
            let aggregationBucket: IMapAggregationBucket | undefined;
            for (let i = 0; i < dataLen; i++) {
                // find the 'geo' properties of the data record
                foundGeos = mapData.getDataRecordValues(geoDimension, data[i]);
                // since the data are flattened we can expect max one found item
                if(foundGeos.length == 1 && typeof foundGeos[0] == "string") {
                    // get the aggregation bucket map for the country or create a new one
                    bucketMap = bucketMaps.get(foundGeos[0]);
                    if(!bucketMap) {
                        bucketMap = new Map<string, IMapAggregationBucket>();
                        bucketMaps.set(foundGeos[0], bucketMap);
                    }
                    // find the 'category' properties
                    foundCategories = mapData.getDataRecordValues(categoryDimension, data[i]);
                    // since the data are flattened we can expect max one found item
                    if(foundCategories.length == 1) {
                        // get the aggregation bucket for the category or create a new one
                        aggregationBucket = bucketMap.get(foundGeos[0]);
                        if(!aggregationBucket) {
                            aggregationBucket = aggregationDimension.getAggregationBucket();
                            bucketMap.set(foundGeos[0], aggregationBucket);
                        }
                        // find the 'value' properties
                        foundValues = mapData.getDataRecordValues(valueDimension, data[i]);
                        // since the data are flattened we can expect max one found item
                        aggregationBucket.addValue(foundValues.length == 1 ? (typeof foundValues[0] == "number" ? foundValues[0] : 1) : 0);
                    }
                }
            }
        }

        // updates bucket data
        this.getState().setBucketData(bucketMaps);

        return bucketMaps;
    }

    /**
     * It creates markers using bucket data
     */
    protected createMarkers(): L.Marker[] {
        // create markers
        const markers: L.Marker[] = [];

        const bucketMaps: Map<string, Map<string, IMapAggregationBucket>> = this.getState().getBucketData();
        const layerGroup: L.LayerGroup | undefined = this.getState().getMarkerLayerGroup();
        // TODO: specify the type
        const centroids: any = this.getState().getCentroids();
        const selectedIds: string[] | undefined = this.getSelectionTool()?.getState().getSelection()?.getIds();

        // iterate over centroids
        let centroid, bucketMap, marker;
        for(let i = 0; i < centroids.length; i++) {
            centroid = centroids[i];
            bucketMap = bucketMaps.get(centroid.id);
            if(bucketMap && (!selectedIds || selectedIds.includes(centroid.id))) {
                // create marker
                marker = this.createMarker(centroid, bucketMap);
                layerGroup?.addLayer(marker);
                markers.push(marker);
            }
        }

        // updates bucket data
        this.getState().setMarkers(markers);

        return markers;
    }

    /**
     * It creates one marker with respect to the given centroid and data.
     * 
     * TODO: specify the types
     * 
     * @param centroid 
     * @param data 
     */
    protected createMarker(centroid: any, bucketMap: Map<string, IMapAggregationBucket>): L.Marker {
        // help function for popup numbers
        const formatPopUpNumber = function(num: number) {
            const numParts = num.toString().split(".");
            numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return numParts.join(".");
        };

        // build categories popup messages
        let popupMsg = "<b>" + centroid.name + "</b><br>";
        let value, sumValue = 0;
        for(const [category, bucket] of bucketMap) {
            value = bucket.getValue();
            popupMsg += category + ": " + formatPopUpNumber(value) + "<br>";
            sumValue += value;
        }

        // prepend title popup message
        popupMsg = "<b>" + centroid.name + "</b><br>" + (sumValue != null ? formatPopUpNumber(sumValue) : "N/A") + "<br>"
                    + popupMsg;

        // create marker with a icon
        const icon = new MarkerIcon();
        icon.values = {
            id: centroid.name,
            value: sumValue,
            subvalues: bucketMap
        };
        const marker = L.marker([centroid.lat, centroid.long], {
            icon: icon
        });
        (marker as any).id = centroid.name,
        marker.bindPopup(popupMsg);
        return marker;
    }

    /**
     * It reloads data and redraw the layer.
     */
    public redraw(onlyStyle: boolean): void {
        if(this.getState().getMarkerLayerGroup()) {
            // delete actual items
            this.deleteLayerItems();

            // prepare data
            this.processData();

            // update map
            this.createMarkers();
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
            this.redraw(false);
            // TODO
        } else if(event.getType() == ThemesToolEvent.TYPE()) {
            // theme change
            // TODO
        }
    }
}

export default MarkerLayerTool;