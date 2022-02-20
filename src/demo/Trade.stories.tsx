// Storybook
import {
    Story,
    Meta
} from '@storybook/react/types-6-0';

// React
import React, { Component } from "react";

// React-Geovisto
import ReactGeovistoMap from "../react/ReactGeovistoMap";

import './Trade.scss';

// Geovisto Tools
import {
    GeovistoSidebarTool,
    GeovistoFiltersTool,
    GeovistoThemesTool,
    GeovistoSelectionTool,
    GeovistoTilesLayerTool,
    GeovistoChoroplethLayerTool,
    GeovistoMarkerLayerTool,
    GeovistoConnectionLayerTool,
    GeovistoDrawingLayerTool
} from '../tools';
import { Geovisto } from '..';
import {GeneralInfo_export} from "./General.stories";


class Trade1 extends Component<Record<string, never>, { data: unknown, config: Record<string, unknown> }> {

    private polygons: unknown;
    private centroids: unknown;
    private polygons2: unknown;
    private centroids2: unknown;
    private map: React.RefObject<ReactGeovistoMap>;

    public constructor(props: Record<string, never>) {
        super(props);

        // initialize geo objects
        this.polygons = require("/static/geo/country_polygons.json");
        this.centroids = require("/static/geo/country_centroids.json");

        // data and config can be changed
        this.state = {
            // implicit data
            data: require('/static/data/trade_oecd.json'),
            // implicit config
            config: require('/static/config/trade_config.json')
        };

        // reference to the rendered map
        this.map = React.createRef();
    }


    public render(): JSX.Element {
        console.log("rendering...");
        return (
            <div className="demo-container">
                <div className="demo-toolbar">
                    Trade in services between OECD countries and USA, GBR, CAN, AUS | unit: US Dollars - Millions | <a href={"https://stats.oecd.org/#"} target={"_blank"}>source</a>
                </div>
                <div className="demo-map">
                    <ReactGeovistoMap
                        ref={this.map}
                        id="my-geovisto-map"
                        data={Geovisto.getMapDataManagerFactory().json(this.state.data)}
                        geoData={Geovisto.getGeoDataManager([
                            Geovisto.getGeoDataFactory().geojson("world polygons", this.polygons),
                            Geovisto.getGeoDataFactory().geojson("world centroids", this.centroids),
                        ])}
                        config={Geovisto.getMapConfigManagerFactory().default(this.state.config)}
                        globals={undefined}
                        templates={undefined}
                        tools={Geovisto.createMapToolsManager([
                            GeovistoSidebarTool.createTool({
                                id: "geovisto-tool-sidebar",
                            }),
                            GeovistoFiltersTool.createTool({
                                id: "geovisto-tool-filters",
                                manager: GeovistoFiltersTool.createFiltersManager([
                                    // filter operations
                                    GeovistoFiltersTool.createFilterOperationEq(),
                                    GeovistoFiltersTool.createFilterOperationNeq(),
                                    GeovistoFiltersTool.createFilterOperationReg()
                                ])
                            }),
                            GeovistoThemesTool.createTool({
                                id: "geovisto-tool-themes",
                                manager: GeovistoThemesTool.createThemesManager([
                                    // style themes
                                    GeovistoThemesTool.createThemeLight1(),
                                    GeovistoThemesTool.createThemeLight2(),
                                    GeovistoThemesTool.createThemeLight3(),
                                    GeovistoThemesTool.createThemeDark1(),
                                    GeovistoThemesTool.createThemeDark2(),
                                    GeovistoThemesTool.createThemeDark3(),
                                    GeovistoThemesTool.createThemeBasic()
                                ])
                            }),
                            GeovistoSelectionTool.createTool({
                                id: "geovisto-tool-selection"
                            }),
                            GeovistoTilesLayerTool.createTool({
                                id: "geovisto-tool-layer-map"
                            }),
                            GeovistoChoroplethLayerTool.createTool({
                                id: "geovisto-tool-layer-choropleth"
                            }),
                            GeovistoMarkerLayerTool.createTool({
                                id: "geovisto-tool-layer-marker"
                            }),
                            GeovistoConnectionLayerTool.createTool({
                                id: "geovisto-tool-layer-connection"
                            }),
                            GeovistoDrawingLayerTool.createTool({
                                id: "geovisto-tool-layer-drawing"
                            }),
                        ])}
                    />
                </div>
            </div>
        );
    }
}

class TradeUSOil extends Component<Record<string, never>, { data: unknown, config: Record<string, unknown> }> {

    private polygons: unknown;
    private centroids: unknown;
    private polygons2: unknown;
    private centroids2: unknown;
    private map: React.RefObject<ReactGeovistoMap>;

    public constructor(props: Record<string, never>) {
        super(props);

        // initialize geo objects
        this.polygons = require("/static/geo/country_polygons.json");
        this.centroids = require("/static/geo/country_centroids.json");

        // data and config can be changed
        this.state = {
            // implicit data
            data: require('/static/data/usa_oil_oecd.json'),
            // implicit config
            config: require('/static/config/trade_oil_config.json')
        };

        // reference to the rendered map
        this.map = React.createRef();
    }


    public render(): JSX.Element {
        console.log("rendering...");
        return (
            <div className="demo-container">
                <div className="demo-toolbar">
                    Import of crude oil to USA | unit: US Dollars - Millions | <a href={"https://stats.oecd.org/#"} target={"_blank"}>source</a>
                </div>
                <div className="demo-map">
                    <ReactGeovistoMap
                        ref={this.map}
                        id="my-geovisto-map"
                        data={Geovisto.getMapDataManagerFactory().json(this.state.data)}
                        geoData={Geovisto.getGeoDataManager([
                            Geovisto.getGeoDataFactory().geojson("world polygons", this.polygons),
                            Geovisto.getGeoDataFactory().geojson("world centroids", this.centroids),
                        ])}
                        config={Geovisto.getMapConfigManagerFactory().default(this.state.config)}
                        globals={undefined}
                        templates={undefined}
                        tools={Geovisto.createMapToolsManager([
                            GeovistoSidebarTool.createTool({
                                id: "geovisto-tool-sidebar",
                            }),
                            GeovistoFiltersTool.createTool({
                                id: "geovisto-tool-filters",
                                manager: GeovistoFiltersTool.createFiltersManager([
                                    // filter operations
                                    GeovistoFiltersTool.createFilterOperationEq(),
                                    GeovistoFiltersTool.createFilterOperationNeq(),
                                    GeovistoFiltersTool.createFilterOperationReg()
                                ])
                            }),
                            GeovistoThemesTool.createTool({
                                id: "geovisto-tool-themes",
                                manager: GeovistoThemesTool.createThemesManager([
                                    // style themes
                                    GeovistoThemesTool.createThemeLight1(),
                                    GeovistoThemesTool.createThemeLight2(),
                                    GeovistoThemesTool.createThemeLight3(),
                                    GeovistoThemesTool.createThemeDark1(),
                                    GeovistoThemesTool.createThemeDark2(),
                                    GeovistoThemesTool.createThemeDark3(),
                                    GeovistoThemesTool.createThemeBasic()
                                ])
                            }),
                            GeovistoSelectionTool.createTool({
                                id: "geovisto-tool-selection"
                            }),
                            GeovistoTilesLayerTool.createTool({
                                id: "geovisto-tool-layer-map"
                            }),
                            GeovistoChoroplethLayerTool.createTool({
                                id: "geovisto-tool-layer-choropleth"
                            }),
                            GeovistoMarkerLayerTool.createTool({
                                id: "geovisto-tool-layer-marker"
                            }),
                            GeovistoConnectionLayerTool.createTool({
                                id: "geovisto-tool-layer-connection"
                            }),
                            GeovistoDrawingLayerTool.createTool({
                                id: "geovisto-tool-layer-drawing"
                            }),
                        ])}
                    />
                </div>
            </div>
        );
    }
}

export default {
    title: 'Trade',
    component: Trade1,
} as Meta;

export const TradeUsaGbrCanAus: Story = () => <Trade1 />;
TradeUsaGbrCanAus.storyName = "USA-GBR-CAN-AUS - OECD";
TradeUsaGbrCanAus.parameters = { // Disable tools panel
    options:
        {showPanel: false}
};

export const TradeUSOil_export: Story = () => <TradeUSOil />;
TradeUSOil_export.storyName = "Import of oil - USA";
TradeUSOil_export.parameters = { // Disable tools panel
    options:
        {showPanel: false}
};
