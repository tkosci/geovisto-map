// d3
import {
    select as d3select
} from "d3";

// Geovisto core
import {
    IMapChangeEvent,
    IMapEvent
} from "../../../../../../index.core";

// Geovisto Selection Tool API
import {
    IMapSelection,
    ISelectionToolAPI,
    ISelectionToolAPIGetter
} from "../../../../../selection";

import IConnectionLayerTool from "../../types/tool/IConnectionLayerTool";

/**
 * This class provides Selection tool change event adapter.
 * 
 * @author Jiri Hynek
 */
class SelectionChangeAdapter {
    
    private selectionToolAPI?: ISelectionToolAPI;

    private tool: IConnectionLayerTool;

    public constructor(tool: IConnectionLayerTool) {
        this.tool = tool;
    }

    /**
     * Help function which acquires and returns the selection tool if available.
     */
    private getSelectionTool(): ISelectionToolAPI | undefined {
        if(this.selectionToolAPI == undefined) {
            const api = this.tool.getMap()?.getState().getToolsAPI() as ISelectionToolAPIGetter;
            if(api.getGeovistoSelectionTool) {
                this.selectionToolAPI = api.getGeovistoSelectionTool();
            }
        }
        return this.selectionToolAPI;
    }

    /**
     * This function is called when a custom event is invoked.
     * 
     */
    public handleEvent(event: IMapEvent): void {
        if(event.getType() == this.getSelectionTool()?.getChangeEventType()) {
            this.setSelection(<IMapSelection> (<IMapChangeEvent> event).getChangedObject());            
        }
    }

    /**
     * This function acquires current selection and updates styles according to the given selection.
     */
    public updateSelection(): void {
        this.setSelection(this.getSelectionTool()?.getSelection());
    }

    /**
     * This function updates styles according to the given selection.
     * 
     * @param selection 
     */
    public setSelection(selection: IMapSelection | null | undefined): void {
        const overlayPane: HTMLElement | undefined = this.tool.getState().getSVGLayer()?.getPane();
        if(overlayPane) {
            // get overleay pane, svg g element and paths
            const paths = d3select(overlayPane)
                            .select("svg")
                            .select("g")
                            .selectAll("path.leaflet-layer-connection");

            if(selection && selection.getSrcIds().length > 0) {
                const selectionSrcIds = selection.getSrcIds();

                // process all paths and find the affected ones
                let from, to;
                const affectedIds: string[] = [];
                // TODO specify the types
                let thisHTMLElement: HTMLElement;
                paths.each(function(d: unknown) {
                    if(Array.isArray(d)) {
                        // from
                        from = d[0].id;
                        to = d[d.length-1].id;
                        thisHTMLElement = this as HTMLElement;
                        if(selectionSrcIds.includes(from)) {
                            // highlight
                            thisHTMLElement.classList.add("leaflet-layer-connection-highlight");
                            thisHTMLElement.classList.remove("leaflet-layer-connection-other");
                            // check affected country
                            if(!affectedIds.includes(to)) {
                                affectedIds.push(to);
                            }
                        } else if(selectionSrcIds.includes(to)) {
                            // highlight
                            thisHTMLElement.classList.add("leaflet-layer-connection-highlight");
                            thisHTMLElement.classList.remove("leaflet-layer-connection-other");
                            // check affected country
                            if(!affectedIds.includes(from)) {
                                affectedIds.push(from);
                            }
                        } else {
                            //if(this.getAttribute("class") == "leaflet-layer-connection") {
                                // deemphasize if it is not already highlighted
                                thisHTMLElement.classList.add("leaflet-layer-connection-other");
                                thisHTMLElement.classList.remove("leaflet-layer-connection-highlight");
                            //}
                        }
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
                paths.classed("leaflet-layer-connection-highlight", false);
                paths.classed("leaflet-layer-connection-other", false);
            }
        }
    }
}
export default SelectionChangeAdapter;