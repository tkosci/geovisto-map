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
import {EnergyMix} from "./Energy.stories";


class GeneralInfo extends Component<Record<string, never>, { data: unknown, config: Record<string, unknown> }> {

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
            data: require('/static/data/countryInfo.json'),
            // implicit config
            config: require('/static/config/general_info_config.json')
        };

        // reference to the rendered map
        this.map = React.createRef();
    }


    public render(): JSX.Element {
        console.log("rendering...");
        return (
            <div className="demo-container">
                <div className="demo-toolbar">
                    General info about countries (f.e. population, life expectancy), <a href={"https://github.com/geovisto/" +
                    "geovisto-samples/tree/main/src/stories/assets/datasets/CountryInformations"} target={"_blank"}>source</a>
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

class Violence extends Component<Record<string, never>, { data: unknown, config: Record<string, unknown> }> {

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
            data: require('/static/data/womenViolence.json'),
            // implicit config
            config: require('/static/config/violence_config.json')
        };

        // reference to the rendered map
        this.map = React.createRef();
    }


    public render(): JSX.Element {
        console.log("rendering...");
        return (
            <div className="demo-container">
                <div className="demo-toolbar">
                    Violence on women | unit: percentage | <a href={"https://github.com/geovisto/geovisto-samples/" +
                "tree/main/src/stories/assets/datasets/ViolentOnWomen"} target={"_blank"}>source</a>
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
    title: 'General',
    component: GeneralInfo,
} as Meta;

export const GeneralInfo_export: Story = () => <GeneralInfo />;
GeneralInfo_export.storyName = "General info - World";
GeneralInfo_export.parameters = { // Disable tools panel
    options:
        {showPanel: false}
};
export const Violence_export: Story = () => <Violence />;
Violence_export.storyName = "Violence on women - World";
Violence_export.parameters = { // Disable tools panel
    options:
        {showPanel: false}
};