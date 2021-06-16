import { Feature, Point } from 'geojson';
import { Icon, MarkerClusterGroup } from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '../../../style/markerLayer.scss'; 
import MarkerLayerToolMapForm from '../form/MarkerLayerToolMapForm';
import MarkerLayerToolDefaults from './MarkerLayerToolDefaults';
import MarkerLayerToolState from './MarkerLayerToolState';
import AbstractLayerTool from '../../../../../../model/internal/layer/AbstractLayerTool';
import ThemesToolEvent from '../../../../../themes/model/internal/event/ThemesToolEvent';
import SelectionToolEvent from '../../../../../selection/model/internal/event/SelectionToolEvent';
import DataChangeEvent from '../../../../../../model/internal/event/data/DataChangeEvent';
import IMarkerLayerTool from '../../types/tool/IMarkerLayerTool';
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
import { IMapToolInitProps } from '../../../../../../model/types/tool/IMapToolProps';
import { IMarkerLayerToolConfig } from '../../types/tool/IMarkerLayerToolConfig';
import LayerToolRedrawEnum from '../../../../../../model/types/layer/LayerToolRedrawEnum';
import IMapDimension from '../../../../../../model/types/dimension/IMapDimension';
import IMapDomain from '../../../../../../model/types/domain/IMapDomain';
import GeoJSONTypes from '../../../../../../model/types/geodata/GeoJSONTypes';
import IMarker from '../../types/marker/IMarker';
import IMarkerIconOptions from '../../types/marker/IMarkerIconOptions';
import Marker from '../marker/Marker';
import IMapForm from '../../../../../../model/types/form/IMapForm';
import IMapFormControl from '../../../../../../model/types/form/IMapFormControl';

/**
 * This class represents Marker layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class MarkerLayerTool extends AbstractLayerTool implements IMarkerLayerTool, IMapFormControl {

    private selectionTool: ISelectionTool | undefined;
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props?: IMarkerLayerToolProps) {
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
        return new MarkerLayerToolDefaults();
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
        return new MarkerLayerToolMapForm(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IMarkerLayerToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates layer items.
     */
    protected createLayerItems(): L.Layer[] {
        // create layer which clusters points
        //let layer = L.layerGroup([]);
        const markerLayerGroup: MarkerClusterGroup = new MarkerClusterGroup({
            // create cluster icon
            iconCreateFunction: (cluster) => {
                // take child markers and construct options for the parent marker
                const markers: Marker<Icon<IMarkerIconOptions>>[] = cluster.getAllChildMarkers() as Marker<Icon<IMarkerIconOptions>>[];
                const values = { id: "<Group>", value: 0, subvalues: new Map<string, number>() };
                let currentIcon: Icon<IMarkerIconOptions>;
                let subvalue: number | undefined;
                // go through all child markers and calculate sum of their values and subvalues
                for (let i = 0; i < markers.length; i++) {
                    currentIcon = markers[i].getIcon();
                    values.value += (currentIcon)?.options.values.value;
                    for(const [key, value] of (currentIcon)?.options.values.subvalues) {
                        subvalue = values.subvalues.get(key);
                        if(subvalue == undefined) {
                            values.subvalues.set(key, value);
                        } else {
                            values.subvalues.set(key, value + subvalue);
                        }
                    }
                }
                // create icon for the parent marker
                const icon = this.getDefaults().getMarkerIcon({
                    values: values,
                    isGroup: true,
                    useDonut: markers[0].getIcon()?.options.useDonut
                });
                return icon;
            }
        });

        // update state and redraw
        this.getState().setMarkerLayerGroup(markerLayerGroup);
        this.redraw(LayerToolRedrawEnum.DATA);

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
    protected updateData(): Map<string, Map<string, IMapAggregationBucket>> {
        // initialize a hash map of aggreation buckets
        const bucketMaps = new Map<string, Map<string, IMapAggregationBucket>>();

        // get dimensions
        const dimensions: IMarkerLayerToolDimensions = this.getState().getDimensions();
        const geoDimension: IMapDataDomain | undefined = dimensions.geoId.getDomain();
        const valueDimension: IMapDataDomain | undefined = dimensions.value.getDomain();
        const aggregationDimension: IMapAggregationFunction | undefined = dimensions.aggregation.getDomain();
        const categoryDimension: IMapDataDomain | undefined = dimensions.category.getDomain();
        const map = this.getMap();

        // test whether the dimension are set
        if(geoDimension && aggregationDimension && map) {
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;
            let foundGeos: unknown[], foundValues: unknown[], foundCategories: unknown[], foundCategory: string;
            
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
                    foundCategories = categoryDimension ? mapData.getDataRecordValues(categoryDimension, data[i]) : [ "" ];
                    // since the data are flattened we can expect max one found item
                    if(foundCategories.length == 1) {
                        foundCategory = typeof foundCategories[0] === "string" ? foundCategories[0] : new String(foundCategories[0]).toString();
                        // get the aggregation bucket for the category or create a new one
                        aggregationBucket = bucketMap.get(foundCategory);
                        if(!aggregationBucket) {
                            aggregationBucket = aggregationDimension.getAggregationBucket();
                            bucketMap.set(foundCategory, aggregationBucket);
                        }
                        // find the 'value' properties
                        foundValues = valueDimension ? mapData.getDataRecordValues(valueDimension, data[i]) : [ 1 ];
                        // since the data are flattened we can expect max one found item
                        aggregationBucket.addValue(foundValues.length == 1 ? (typeof foundValues[0] == "number" ? foundValues[0] : 1) : 0);
                    }
                }
            }
        }

        // update bucket data
        this.getState().setBucketData(bucketMaps);

        return bucketMaps;
    }

    /**
     * It creates markers using bucket data
     */
    protected createMarkers(): IMarker<Icon<IMarkerIconOptions>>[] {
        // create markers
        const markers: IMarker<Icon<IMarkerIconOptions>>[] = [];

        const bucketMaps: Map<string, Map<string, IMapAggregationBucket>> = this.getState().getBucketData();
        const layerGroup: L.LayerGroup | undefined = this.getState().getMarkerLayerGroup();
        const pointFeatures: Feature[] | undefined = this.getState().getDimensions().geoData.getDomain()?.getFeatures([ GeoJSONTypes.Point ]).features;
        const selectedIds: string[] | undefined = this.getSelectionTool()?.getState().getSelection()?.getIds();

        // iterate over point features
        let pointFeature: Feature;
        let bucketMap: Map<string, IMapAggregationBucket> | undefined;
        let marker: IMarker<Icon<IMarkerIconOptions>>;
        if(pointFeatures) {
            for(let i = 0; i < pointFeatures.length; i++) {
                pointFeature = pointFeatures[i];
                if(pointFeature.id) {
                    bucketMap = bucketMaps.get(pointFeature.id.toString());
                    if(bucketMap && (!selectedIds || selectedIds.includes(pointFeature.id.toString()))) {
                        // create marker
                        marker = this.createMarker(pointFeature, bucketMap);
                        layerGroup?.addLayer(marker);
                        markers.push(marker);
                    }
                }
            }
        }

        // updates bucket data
        this.getState().setMarkers(markers);

        return markers;
    }

    /**
     * It creates one marker with respect to the given GeoJSON point feature and data.
     * 
     * @param pointFeature 
     * @param data 
     */
    protected createMarker(pointFeature: Feature, bucketMap: Map<string, IMapAggregationBucket>): IMarker<Icon<IMarkerIconOptions>> {
        // help function for popup numbers
        const formatPopUpNumber = function(num: number) {
            const numParts = num.toString().split(".");
            numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return numParts.join(".");
        };

        // build categories popup messages
        let popupMsg = "";
        let subValue, value = 0;
        const subValuesMap = new Map<string, number>();
        for(const [category, bucket] of bucketMap) {
            subValue = bucket.getValue();
            popupMsg += category + ": " + formatPopUpNumber(subValue) + "<br>";
            value += subValue;
            subValuesMap.set(category, subValue);
        }

        // prepend title popup message
        popupMsg = "<b>" + pointFeature.properties?.name + "</b><br>" + (value != null ? formatPopUpNumber(value) : "N/A") + "<br><br>"
                    + popupMsg;

        // create icon
        const icon = this.getDefaults().getMarkerIcon({
            useDonut: this.getState().getDimensions().category.getDomain() !== undefined,
            isGroup: false,
            values: {
                id: pointFeature.properties?.name,
                value: value,
                subvalues: subValuesMap
            }
        });

        // create marker
        const coordinates = (pointFeature.geometry as Point).coordinates;
        const marker = this.getDefaults().getMarker([coordinates[0], coordinates[1]], {
            icon: icon
        });

        // create popop
        marker.bindPopup(popupMsg);

        return marker;
    }

    /**
     * It updates the dimension.
     * 
     * @param dimension 
     * @param value 
     * @param redraw 
     */
    public updateDimension(dimension: IMapDimension<IMapDomain>, value: string, redraw: number | undefined): void {
        if(!redraw) {
            const dimensions = this.getState().getDimensions();
            switch (dimension) {
                case dimensions.geoData:
                    redraw = LayerToolRedrawEnum.LAYER;
                    break;
                case dimensions.geoId:
                case dimensions.value:
                case dimensions.category:
                case dimensions.aggregation:
                    redraw = LayerToolRedrawEnum.DATA;
                    break;
                default:
                    redraw = LayerToolRedrawEnum.STYLE;
                    break;
            }
        }
        super.updateDimension(dimension, value, redraw);
    }

    /**
     * It reloads data and redraw the layer.
     */
    public redraw(type: number): void {
        switch (type) {
            case LayerToolRedrawEnum.LAYER:
            case LayerToolRedrawEnum.DATA:
                this.updateData();
                this.deleteLayerItems();
                this.createMarkers();
                break;
            default:
                // update style
                // TODO
                //this.updateStyle();
                break;
        }
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        switch (event.getType()) {
            case DataChangeEvent.TYPE():
            case SelectionToolEvent.TYPE():
                this.redraw(LayerToolRedrawEnum.DATA);
                break;
            case ThemesToolEvent.TYPE():
                this.redraw(LayerToolRedrawEnum.STYLE);
                break;
            default:
                break;
        }
    }
}

export default MarkerLayerTool;