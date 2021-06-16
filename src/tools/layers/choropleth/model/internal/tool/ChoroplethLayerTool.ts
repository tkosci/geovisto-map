// GeoJSON
import {
    Feature,
    GeoJsonProperties,
    MultiPolygon,
    Polygon
} from 'geojson';

// Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import '../../../style/choroplethLayer.scss';

import AbstractLayerTool from '../../../../../../model/internal/layer/AbstractLayerTool';
import ChoroplethLayerToolState from './ChoroplethLayerToolState';
import ChoroplethLayerToolDefaults from './ChoroplethLayerToolDefaults';
import ChoropolethLayerToolMapForm from '../form/ChoroplethLayerToolMapForm';
import ThemesToolEvent from '../../../../../themes/model/internal/event/ThemesToolEvent';
import SelectionToolEvent from '../../../../../selection/model/internal/event/SelectionToolEvent';
import DataChangeEvent from '../../../../../../model/internal/event/data/DataChangeEvent';
import IChoroplethLayerTool from '../../types/tool/IChoroplethLayerTool';
import IChoroplethLayerToolProps from '../../types/tool/IChoroplethLayerToolProps';
import IChoroplethLayerToolDefaults from '../../types/tool/IChoroplethLayerToolDefaults';
import IChoroplethLayerToolState from '../../types/tool/IChoroplethLayerToolState';
import { GeovistoSelectionTool, ISelectionTool, IMapSelection } from '../../../../../selection';
import IMapDataDomain from '../../../../../../model/types/data/IMapDataDomain';
import IChoroplethLayerToolDimensions from '../../types/tool/IChoroplethLayerToolDimensions';
import IMapAggregationFunction from '../../../../../../model/types/aggregation/IMapAggregationFunction';
import IMapAggregationBucket from '../../../../../../model/types/aggregation/IMapAggregationBucket';
import IMapEvent from '../../../../../../model/types/event/IMapEvent';
import IMapDataManager from '../../../../../../model/types/data/IMapDataManager';
import IMapData from '../../../../../../model/types/data/IMapData';
import { IMapToolInitProps } from '../../../../../../model/types/tool/IMapToolProps';
import { IChoroplethLayerToolConfig } from '../../types/tool/IChoroplethLayerToolConfig';
import IMapDimension from '../../../../../../model/types/dimension/IMapDimension';
import IMapDomain from '../../../../../../model/types/domain/IMapDomain';
import LayerToolRedrawEnum from '../../../../../../model/types/layer/LayerToolRedrawEnum';
import GeoJSONTypes from '../../../../../../model/types/geodata/GeoJSONTypes';
import IMapFormControl from '../../../../../../model/types/form/IMapFormControl';
import IMapForm from '../../../../../../model/types/form/IMapForm';

/**
 * This class represents Choropleth layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerTool extends AbstractLayerTool implements IChoroplethLayerTool, IMapFormControl {

    private selectionTool: ISelectionTool | undefined;
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props?: IChoroplethLayerToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): IChoroplethLayerTool {
        return new ChoroplethLayerTool(this.getProps());
    }

    /**
     * It returns the props given by the programmer.
     */
    public getProps(): IChoroplethLayerToolProps {
        return <IChoroplethLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): IChoroplethLayerToolDefaults {
        return <IChoroplethLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the tool.
     */
    protected createDefaults(): IChoroplethLayerToolDefaults {
        return new ChoroplethLayerToolDefaults();
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): IChoroplethLayerToolState {
        return <IChoroplethLayerToolState> super.getState();
    }

    /**
     * It returns default tool state.
     */
    protected createState(): IChoroplethLayerToolState {
        return new ChoroplethLayerToolState(this);
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
        // override if needed
        return new ChoropolethLayerToolMapForm(this);
    }

    /**
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<IChoroplethLayerToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates layer items.
     */
    protected createLayerItems(): L.Layer[] {
        const map: L.Map | undefined = this.getMap()?.getState().getLeafletMap();
        if(map) {
            const paneId: string = this.getId();
            const pane: HTMLElement | undefined = this.getMap()?.getState().getLeafletMap()?.createPane(paneId);
            if(pane) {
                // set z-index
                pane.style.zIndex = this.getState().getZIndex().toString();

                // create geojson layer
                const geoJSONlayer: L.GeoJSON = this.createGeoJSONLayer();
                this.getState().setGeoJSONLayer(geoJSONlayer);
            
                return [ geoJSONlayer ];
            }
        }
        return [];
    }

    /**
     * It creates an instance of the Leaflet GeoJSON layer.
     */
    protected createGeoJSONLayer(): L.GeoJSON {
        const geoJSON = this.getState().getDimensions().geoData.getDomain()?.getFeatures([ GeoJSONTypes.MultiPolygon, GeoJSONTypes.Polygon ]);
        const layer: L.GeoJSON = new L.GeoJSON(geoJSON, {
            onEachFeature: this.getOnEachFeatureFunction(),
            pane: this.getId()
        });
        return layer;
    }

    /**
     * It returns the onEachFeature property for the GeoJSON layer.
     */
    protected getOnEachFeatureFunction() {
        return (feature: Feature, layer: L.Layer): void => {
            layer.on({
                mouseover: this.getMouseOverFunction(),
                mouseout: this.getMouseOutFunction(),
                click: this.getClickFunction()
            });
        };
    }

    /**
     * It returns the mouseover property for the GeoJSON layer.
     */
    protected getMouseOverFunction(): (e: L.LeafletMouseEvent) => void {
        const separateThousands = (num: number): string => {
            const numParts = num.toString().split(".");
            numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
            return numParts.join(".");
        };

        return (e: L.LeafletMouseEvent): void => {
            const layerItem: L.Polygon = e.target;
            const id: string | undefined = layerItem.feature?.id?.toString();
            this.getState().setHoveredItem(id);
            this.updateItemStyle(layerItem);
            this.getState().getBucketData().get(layerItem.feature?.id?.toString() ?? "");
            const popupText: string = "<b>" + e.target.feature.name + "</b><br>"
                                + this.getState().getDimensions().aggregation.getDomain()?.getName() + ": "
                                + separateThousands(id ? (this.getState().getBucketData().get(id)?.getValue() ?? 0) : 0);
            e.target.bindTooltip(popupText,{className: 'leaflet-popup-content', sticky: true}).openTooltip();
        
            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layerItem.bringToFront();
            }
        };
    }

    /**
     * It returns the mouseout property for the GeoJSON layer.
     */
    protected getMouseOutFunction(): (e: L.LeafletMouseEvent) => void {
        return (e: L.LeafletMouseEvent): void => {
            const layerItem: L.Polygon = e.target;
            this.getState().setHoveredItem(undefined);
            this.updateItemStyle(layerItem);

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                layerItem.bringToBack();
            }
        };
    }

    /**
     * It returns the click property for the GeoJSON layer.
     */
    protected getClickFunction(): (e: L.LeafletMouseEvent) => void {
        return (e: L.LeafletMouseEvent): void => {
            // notify selection tool
            const selectionTool: ISelectionTool | undefined = this.getSelectionTool();
            if(selectionTool) {
                const id: string | undefined = (e.target as L.Polygon).feature?.id?.toString();
                if(id) {
                    const selection: IMapSelection = GeovistoSelectionTool.createSelection(this, [ id ]);
                    if(selection.equals(selectionTool.getState().getSelection())) {
                        this.getSelectionTool()?.setSelection(null);
                    } else {
                        this.getSelectionTool()?.setSelection(selection);
                    }
                }
            }
        };
    }

    /**
     * This function is called when layer items are rendered.
     */
    protected postProcessLayerItems(): void {
        if(this.getState().getGeoJSONLayer()) {
            this.updateStyle();
        }
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
     * 
     * @param type
     */
    public redraw(type: number): void {
        switch (type) {
            case LayerToolRedrawEnum.LAYER:
                this.updateGeoData();
                this.updateData();
                this.updateStyle();
                break;
            case LayerToolRedrawEnum.DATA:
                this.updateData();
                this.updateStyle();
                break;
            default:
                // update style
                this.updateStyle();
                break;
        }
    }

    /**
     * It updates the polygons of the layer so they represent current geo data.
     * 
     * @returns 
     */
    protected updateGeoData(): L.GeoJSON | undefined {
        const layer = this.getState().getGeoJSONLayer();

        if(layer) {
            layer.clearLayers();
            const geoJSON = this.getState().getDimensions().geoData.getDomain()?.getFeatures([ GeoJSONTypes.MultiPolygon, GeoJSONTypes.Polygon ]);
            if(geoJSON) {
                layer.addData(geoJSON);
            }
        }

        return layer;
    }

    /**
     * It updates the bucket data so it represents the current data.
     */
    protected updateData(): Map<string, IMapAggregationBucket> {
        // initialize a hash map of aggreation buckets
        const bucketMap = new Map<string, IMapAggregationBucket>();

        // get dimensions
        const dimensions: IChoroplethLayerToolDimensions = this.getState().getDimensions();
        const geoIdDimension: IMapDataDomain | undefined = dimensions.geoId.getDomain();
        const valueDimension: IMapDataDomain | undefined = dimensions.value.getDomain();
        const aggregationDimension: IMapAggregationFunction | undefined = dimensions.aggregation.getDomain();
        const map = this.getMap();

        // test whether the dimension are set
        if(geoIdDimension && aggregationDimension && map) {
            // and go through all data records
            const mapData: IMapDataManager = map.getState().getMapData();
            const data: IMapData = map.getState().getCurrentData();
            const dataLen: number = data.length;
            let foundGeos: unknown[], foundValues: unknown[];
            let aggregationBucket: IMapAggregationBucket | undefined;
            for (let i = 0; i < dataLen; i++) {
                // find the 'geo' properties of the data record
                foundGeos = mapData.getDataRecordValues(geoIdDimension,  data[i]);
                // since the data are flattened we can expect max one found item
                if(foundGeos.length == 1 && typeof foundGeos[0] === "string") {
                    // get aggregation bucket for the country or create a new one
                    aggregationBucket = bucketMap.get(foundGeos[0]);
                    if(!aggregationBucket) {
                        aggregationBucket = aggregationDimension.getAggregationBucket();
                        bucketMap.set(foundGeos[0], aggregationBucket);
                    }
                    // find the 'value' properties
                    foundValues = valueDimension ? mapData.getDataRecordValues(valueDimension, data[i]) : [ 1 ];
                    // since the data are flattened we can expect max one found item
                    aggregationBucket.addValue(foundValues.length == 1 ? (typeof foundValues[0] === "number" ? foundValues[0] : 1) : 0);
                }   
            }
        }

        // updates bucket data
        this.getState().setBucketData(bucketMap);

        return bucketMap;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        switch (event.getType()) {
            case DataChangeEvent.TYPE():
                this.redraw(LayerToolRedrawEnum.DATA);
                break;
            case SelectionToolEvent.TYPE():
            case ThemesToolEvent.TYPE():
                this.redraw(LayerToolRedrawEnum.STYLE);
                break;
            default:
                break;
        }
    }

    /**
     * It updates style of all layer features using the current template.
     */
    protected updateStyle(): void {
        this.getState().getGeoJSONLayer()?.eachLayer((item: L.Layer) => {
            this.updateItemStyle(item);
        });
    }

    /**
     * It updates style of the given feature using the current template.
     */
    protected updateItemStyle(item: L.Layer): void {
        // TODO: use setStyle instead
        //item.setStyle(this.computeStyle(item));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if((item as any)._path != undefined) {
            // modify classes
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (item as any)._path.classList.value = this.computeStyleClasses(item as L.Polygon).join(" ");
        }
    }

    /**
     * It returns style classes for the current template and given feature.
     */
    protected computeStyleClasses(item: L.Polygon): string[] {
        const classList: string[] = [ "leaflet-interactive", "leaflet-choropleth-item-basic" ];

        const feature: Feature<Polygon | MultiPolygon, GeoJsonProperties> | undefined = item.feature;
        const id: string = feature?.id?.toString() ?? "";

        // compute color level
        classList.push(this.computeColorClass(this.getState().getBucketData().get(id)?.getValue() ?? 0));

        // hovered
        if(this.getState().getHoveredItem() == id) {
            classList.push("leaflet-choropleth-item-hover");
        }

        // selected / highlighted
        const selection: IMapSelection | null | undefined = this.getSelectionTool()?.getState().getSelection() ?? undefined;
        const selectedIds: string[] = selection?.getIds() ?? [];
        if(selection && selectedIds.length > 0) {
            if(selectedIds.includes(id)) {
                if(selection.getTool() == this && selection.getSrcIds().includes(id)) {
                    // selected
                    classList.push("leaflet-choropleth-item-select");
                } else {
                    // affected, highlighted
                    classList.push("leaflet-choropleth-item-highlight");
                }
            } else {
                // de-emphasize others
                classList.push("leaflet-choropleth-item-deempasize");
            }
        }

        return classList;
    }

    /**
     * It returns color class for the current template and given value.
     */
    protected computeColorClass(val: number): string {
        const scale = this.getDefaults().getScale();
        return val > scale[6] ? "leaflet-choropleth-item-clr8" :
                val > scale[5] ? "leaflet-choropleth-item-clr7" :
                val > scale[4] ? "leaflet-choropleth-item-clr6" :
                val > scale[3] ? "leaflet-choropleth-item-clr5" :
                val > scale[2] ? "leaflet-choropleth-item-clr4" :
                val > scale[1] ? "leaflet-choropleth-item-clr3" :
                val > scale[0] ? "leaflet-choropleth-item-clr2" :
                "leaflet-choropleth-item-clr1";
    }

}

export default ChoroplethLayerTool;
