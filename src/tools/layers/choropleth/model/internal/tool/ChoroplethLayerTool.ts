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

// own styles
import '../../../style/choroplethLayer.scss';

// Geovisto Selection Tool API
import {
    ISelectionToolAPI,
    ISelectionToolAPIGetter,
    IMapSelection
} from '../../../../../selection';

// Geovisto Themes Tool API
import {
    IMapTheme,
    IThemesToolAPI,
    IThemesToolAPIGetter,
    IThemesToolEvent
} from '../../../../../themes';

// Geovisto core
import {
    AbstractLayerTool,
    DataChangeEvent,
    DataManagerChangeEvent,
    GeoJSONTypes,
    IDataChangeAnimateOptions,
    IMapAggregationBucket,
    IMapAggregationFunction,
    IMapData,
    IMapDataChangeEvent,
    IMapDataDomain,
    IMapDataManager,
    IMapDomainDimension,
    IMapDomain,
    IMapEvent,
    IMapForm,
    IMapFormControl,
    IMapToolInitProps,
    LayerToolRenderType
} from '../../../../../../index.core';

import IChoroplethLayerTool from '../../types/tool/IChoroplethLayerTool';
import { IChoroplethLayerToolConfig } from '../../types/tool/IChoroplethLayerToolConfig';
import IChoroplethLayerToolDefaults from '../../types/tool/IChoroplethLayerToolDefaults';
import IChoroplethLayerToolDimensions from '../../types/tool/IChoroplethLayerToolDimensions';
import ChoropolethLayerToolMapForm from '../form/ChoroplethLayerToolMapForm';
import IChoroplethLayerToolProps from '../../types/tool/IChoroplethLayerToolProps';
import IChoroplethLayerToolState from '../../types/tool/IChoroplethLayerToolState';
import ChoroplethLayerToolDefaults from './ChoroplethLayerToolDefaults';
import ChoroplethLayerToolState from './ChoroplethLayerToolState';
import CustomMinMaxScale from '../scale/CustomMinMaxScale';
import IScale from '../../types/scale/IScale';
import RelativeScale from '../scale/RelativeScale';

/**
 * This class represents Choropleth layer tool. It works with geojson polygons representing countries.
 * 
 * @author Jiri Hynek
 */
class ChoroplethLayerTool extends AbstractLayerTool implements IChoroplethLayerTool, IMapFormControl {

    private selectionToolAPI: ISelectionToolAPI | undefined;
    private themesToolAPI: IThemesToolAPI | undefined;
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
    private getSelectionTool(): ISelectionToolAPI | undefined {
        if(this.selectionToolAPI == undefined) {
            const api = this.getMap()?.getState().getToolsAPI() as ISelectionToolAPIGetter;
            if(api.getGeovistoSelectionTool) {
                this.selectionToolAPI = api.getGeovistoSelectionTool();
            }
        }
        return this.selectionToolAPI;
    }

    /**
     * Help function which acquires and returns the themes tool if available.
     */
    private getThemesTool(): IThemesToolAPI | undefined {
        if(this.themesToolAPI == undefined) {
            const api = this.getMap()?.getState().getToolsAPI() as IThemesToolAPIGetter;
            if(api.getGeovistoThemesTool) {
                this.themesToolAPI = api.getGeovistoThemesTool();
            }
        }
        return this.themesToolAPI;
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
        const geoJSON = this.getState().getDimensions().geoData.getValue()?.getFeatures([ GeoJSONTypes.MultiPolygon, GeoJSONTypes.Polygon ]);
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
            this.hoverItem(layerItem, true);
            this.getState().getBucketData().get(layerItem.feature?.id?.toString() ?? "");
            const popupText: string = "<b>" + e.target.feature.name + "</b><br>"
                                + this.getState().getDimensions().aggregation.getValue()?.getName() + ": "
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
            this.hoverItem(layerItem, false);

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
            const selectionToolAPI: ISelectionToolAPI | undefined = this.getSelectionTool();
            if(selectionToolAPI) {
                const id: string | undefined = (e.target as L.Polygon).feature?.id?.toString();
                if(id) {
                    const selection: IMapSelection = selectionToolAPI.createSelection(this, [ id ]);
                    if(selection.equals(selectionToolAPI.getSelection())) {
                        selectionToolAPI.setSelection(null);
                    } else {
                        selectionToolAPI.setSelection(selection);
                    }
                }
            }
        };
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
            const geoJSON = this.getState().getDimensions().geoData.getValue()?.getFeatures([ GeoJSONTypes.MultiPolygon, GeoJSONTypes.Polygon ]);
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
        const geoIdDimension: IMapDataDomain | undefined = dimensions.geoId.getValue();
        const valueDimension: IMapDataDomain | undefined = dimensions.value.getValue();
        const aggregationDimension: IMapAggregationFunction | undefined = dimensions.aggregation.getValue();
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
     * It reloads data and redraw the layer.
     * 
     * @param type
     */
    public render(type: number, animateOptions?: IDataChangeAnimateOptions): void {
        switch (type) {
            case LayerToolRenderType.LAYER:
                this.updateGeoData();
                this.updateData();
                this.updateStyle();
                break;
            case LayerToolRenderType.DATA:
                this.updateData();
                this.updateStyle(animateOptions);
                break;
            default:
                // update style
                this.updateStyle(animateOptions);
                break;
        }
    }

    /**
     * It updates the dimension.
     * 
     * @param dimension 
     * @param value 
     * @param redraw 
     */
    public updateDimension(dimension: IMapDomainDimension<IMapDomain>, value: string, redraw: number | undefined): void {
        if(!redraw) {
            const dimensions = this.getState().getDimensions();
            switch (dimension) {
                case dimensions.geoData:
                    redraw = LayerToolRenderType.LAYER;
                    break;
                case dimensions.geoId:
                case dimensions.value:
                case dimensions.aggregation:
                    redraw = LayerToolRenderType.DATA;
                    break;
                default:
                    redraw = LayerToolRenderType.STYLE;
                    break;
            }
        }
        super.updateDimension(dimension, value, redraw);
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
            case this.getSelectionTool()?.getChangeEventType():
                this.render(LayerToolRenderType.STYLE);
                break;
            case this.getThemesTool()?.getChangeEventType():
                this.updateTheme((<IThemesToolEvent> event).getChangedObject());
                this.render(LayerToolRenderType.STYLE);
                break;
            default:
                break;
        }
    }

    /**
     * Help function which updates theme with respect to the Themes Tool API.
     * 
     * TODO: move to adapter
     * 
     * @param theme 
     */
    protected updateTheme(theme: IMapTheme): void {
        document.documentElement.style.setProperty('--choropleth-item-hover', theme.getHoverColor());
        document.documentElement.style.setProperty('--choropleth-item-select', theme.getHighlightColor().selected);
        document.documentElement.style.setProperty('--choropleth-item-highlight', theme.getHighlightColor().highlight);
    }

    /**
     * It updates style of all layer features using the current template.
     */
    protected updateStyle(animateOptions?: IDataChangeAnimateOptions): void {
        const scale: number[] | undefined = this.getScale();

        if(scale && scale.length > 0) {
            this.getState().getGeoJSONLayer()?.eachLayer((item: L.Layer) => {
                this.updateItemStyle(item, scale, animateOptions);
            });
        }
    }

    /**
     * Help function which returns a scale which can be used to distinguish value levels in choropleth.
     */
    protected getScale(): number[] | undefined {
        // get values
        const values: number[] = [];
        let id: string | number | undefined;
        let value: number | undefined;
        this.getState().getGeoJSONLayer()?.eachLayer((item: L.Layer) => {
            id = (<L.Polygon> item).feature?.id?.toString() ?? "";
            if(id !== undefined) {
                value = this.getState().getBucketData().get(id)?.getValue();
                if(value) {
                    values.push(value);
                }
            }
        });

        // calculate scale based on user inputs
        let scale: number[] | undefined = undefined;
        const dimensions: IChoroplethLayerToolDimensions = this.getState().getDimensions();
        const rangeDimension: number | undefined = dimensions.range.getValue();
        if(rangeDimension) {
            const customMinMaxDimension: boolean | undefined = dimensions.customMinMax.getValue();
            const scalingDimension: IScale | undefined = dimensions.scaling.getValue();
            if(customMinMaxDimension) {
                const minDimension: number | undefined = dimensions.minValue.getValue();
                const maxDimension: number | undefined = dimensions.maxValue.getValue();
                if(minDimension !== undefined && maxDimension !== undefined) {
                    scale = (new CustomMinMaxScale(minDimension, maxDimension)).getScale(values, rangeDimension);
                } else {
                    scale = (new RelativeScale()).getScale(values, rangeDimension);
                }
            } else if(scalingDimension) {
                scale = scalingDimension.getScale(values, rangeDimension);
            }
        }

        return scale;
    }

    /**
     * It updates style of the given feature using the current template.
     */
    protected updateItemStyle(item: L.Layer, scale: number[], animateOptions?: IDataChangeAnimateOptions): void {
        // TODO: use setStyle instead
        //item.setStyle(this.computeStyle(item));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const anyItem = (item as any);
        if(anyItem._path != undefined) {
            // animation styles
            if(animateOptions) {
                anyItem._path.style.transitionDuration = `${animateOptions.transitionDuration}ms`;
                anyItem._path.style.transitionDelay = `${animateOptions.transitionDelay}ms`;
            }

            // class list
            anyItem._path.classList.value = this.computeStyleClasses(item as L.Polygon, scale).join(" ");
        }
    }

    /**
     * It returns style classes for the current template and given feature.
     */
    protected computeStyleClasses(item: L.Polygon, scale: number[]): string[] {
        const classList: string[] = [ "leaflet-interactive", "leaflet-choropleth-item-basic" ];

        const feature: Feature<Polygon | MultiPolygon, GeoJsonProperties> | undefined = item.feature;
        const id: string = feature?.id?.toString() ?? "";

        // get value
        const value = this.getState().getBucketData().get(id)?.getValue() ?? 0;

        // use color according to the user's preferences
        const dimensions: IChoroplethLayerToolDimensions = this.getState().getDimensions();
        const customColor: boolean | undefined = dimensions.customColor.getValue();
        const color: string | undefined = dimensions.color.getValue();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const path: any = (item as any)._path;
        if(customColor && color) {
            if(value && value >= scale[0]) {
                // compute color level of custom color
                path.style.fill = color;
                path.style.fillOpacity = this.computeColorIntensity(value, scale);
            } else {
                // very low value is represented rather by a light gray (not the fully transparent color)
                path.style.fill = "grey";
                path.style.fillOpacity = 0.3;
            }
        } else {
            // compute color level of the palette of predefined colors
            classList.push(this.computeColorClass(this.getState().getBucketData().get(id)?.getValue() ?? 0, scale));
            // explicit opacity is not required here
            path.style.fill = null;
            path.style.fillOpacity = null;
        }

        // selected / highlighted
        const selection: IMapSelection | null | undefined = this.getSelectionTool()?.getSelection() ?? undefined;
        const selectedIds: string[] = selection?.getIds() ?? [];
        if(selection && selectedIds.length > 0) {
            path.style.fill = null;
            path.style.fillOpacity = null;
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

        // hover
        if(this.getState().getHoveredItem() == id) {
            classList.push("leaflet-choropleth-item-hover");
        }

        return classList;
    }

    /**
     * It returns color class for the current scale and given value.
     * 
     * @param val 
     * @param scale 
     */
    protected computeColorClass(val: number, scale: number[]): string {
        for (let i = scale.length - 1; i >= 0; i--) {
            if (val > scale[i]) {
                return "leaflet-choropleth-item-clr" + (i + 1);
            }
        }
        return "leaflet-choropleth-item-clr0";
    }

    /**
     * It returns color intensity for the current scale and given value.
     * 
     * @param val 
     * @param scale 
     */
    protected computeColorIntensity(val: number, scale: number[]): number {
        for(let i = scale.length - 1; i >= 0; i--) {
            if(val > scale[i]) {
                // round to 2 decimals
                return Math.round(((i + 1) / (scale.length)) * 100) / 100;
            }
        }
        return 0.9;
    }
    
    /**
     * It updates style of the given feature using the current template.
     */
    protected hoverItem(item: L.Layer, hover: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if((item as any)._path != undefined) {
            // modify classes
            if(hover) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((item as any)._path as SVGPathElement).classList.add("leaflet-choropleth-item-hover");
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((item as any)._path as SVGPathElement).classList.remove("leaflet-choropleth-item-hover");
            }
        }
    }

}
export default ChoroplethLayerTool;
