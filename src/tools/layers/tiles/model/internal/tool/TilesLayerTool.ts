// leaflet
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Geovisto Themes Tool API
import {
    IMapTheme,
    IThemesToolAPI,
    IThemesToolAPIGetter
} from '../../../../../themes';

// Geovisto core
import {
    AbstractLayerTool,
    IMapChangeEvent,
    IMapEvent,
    IMapForm,
    IMapFormControl,
    IMapTilesModel,
    IMapToolInitProps
} from '../../../../../../index.core';

import ITilesLayerTool from '../../types/tool/ITilesLayerTool';
import ITilesLayerToolConfig from '../../types/tool/ITilesLayerToolConfig';
import ITilesLayerToolDefaults from '../../types/tool/ITilesLayerToolDefaults';
import ITilesLayerToolState from '../../types/tool/ITilesLayerToolState';
import ITilesLayerToolProps from '../../types/tool/ITilesLayerToolProps';
import TilesLayerToolDefaults from './TilesLayerToolDefaults';
import TilesLayerToolMapForm from '../form/TilesLayerToolMapForm';
import TilesLayerToolState from './TilesLayerToolState';

/**
 * This class represents Map layer tool. It use tile layer and OSM maps.
 * 
 * @author Jiri Hynek
 */
class TilesLayerTool extends AbstractLayerTool implements ITilesLayerTool, IMapFormControl {
    
    private themesToolAPI: IThemesToolAPI | undefined;
    private mapForm!: IMapForm;

    /**
     * It creates a new tool with respect to the props.
     * 
     * @param props 
     */
    public constructor(props?: ITilesLayerToolProps) {
        super(props);
    }

    /**
     * It creates a copy of the uninitialized tool.
     */
    public copy(): ITilesLayerTool {
        return new TilesLayerTool(this.getProps());
    }

    /**
     * Help function which returns the props given by the programmer.
     */
    public getProps(): ITilesLayerToolProps {
        return <ITilesLayerToolProps> super.getProps();
    }

    /**
     * It returns default values of the state properties.
     */
    public getDefaults(): ITilesLayerToolDefaults {
        return <ITilesLayerToolDefaults> super.getDefaults();
    }

    /**
     * It creates new defaults of the layer tool.
     */
    protected createDefaults(): ITilesLayerToolDefaults {
        return new TilesLayerToolDefaults();
    }

    /**
     * It returns the layer tool state.
     */
    public getState(): ITilesLayerToolState {
        return <ITilesLayerToolState> super.getState();
    }

    /**
     * It creates new defaults of the layer tool.
     */
    protected createState(): ITilesLayerToolState {
        return new TilesLayerToolState(this);
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
        return new TilesLayerToolMapForm(this);
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
     * Overrides the super method.
     * 
     * @param initProps
     */
    public initialize(initProps: IMapToolInitProps<ITilesLayerToolConfig>): this {
        return super.initialize(initProps);
    }

    /**
     * It creates layer items.
     */
    protected createLayerItems(): L.Layer[] {
        // create a tile layer
        const layer: L.TileLayer = this.createTileLayer(this.getState().getBaseMap());

        // update state
        this.getState().setTileLayer(layer);

        return [ layer ];
    }

    /**
     * Creates new tile layer
     * 
     * @param tilesModel 
     */
    protected createTileLayer(tilesModel: IMapTilesModel): L.TileLayer {
        const defaultTilesModel = this.getDefaults().getBaseMap();

        const options: L.TileLayerOptions = {
            attribution: tilesModel.attribution ?? "",
            maxZoom: tilesModel.maxZoom ?? defaultTilesModel.maxZoom,
            maxNativeZoom: tilesModel.maxNativeZoom ?? defaultTilesModel.maxNativeZoom
        };

        if(tilesModel.subdomains) {
            options.subdomains = tilesModel.subdomains;
        }

        const layer: L.TileLayer = L.tileLayer(tilesModel.url, options);
        return layer;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     * @param event 
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == this.getThemesTool()?.getChangeEventType()) {
            this.onThemeChange(<IMapTheme> (<IMapChangeEvent> event).getChangedObject());
        }
    }

    /**
     * This function updates theme used in the tool.
     */
    protected onThemeChange(theme: IMapTheme): void {
        // update base map
        this.getState().setBaseMap(theme.getBaseMap());

        let layer: L.TileLayer | undefined = this.getState().getTileLayer();
        // TODO: use public API
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if(layer && (layer as any)._url != theme.getBaseMap()) {
            // remove the old layer
            const leafltMap = this.getMap()?.getState().getLeafletMap();
            if(leafltMap) {
                leafltMap.removeLayer(layer);

                // create a new tile layer
                layer = this.createTileLayer(this.getState().getBaseMap());

                // update state
                this.getState().setTileLayer(layer);

                // add the new layer to the leaflet map
                layer.addTo(leafltMap);
            }
        }
    }
}

export default TilesLayerTool;