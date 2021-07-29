// d3
import {
    pie as d3pie,
    arc as d3arc,
    select as d3select,
    interpolate as d3interpolate,
    Arc,
    PieArcDatum,
    Selection
} from "d3";

// Leaflet
import {
    Icon
} from "leaflet";

// Geovisto core
import {
    IDataChangeAnimateOptions
} from "../../../../../../index.core";

import IMarkerIcon from "../../types/marker/IMarkerIcon";
import { IMarkerIconOptions, IMarkerIconValueOptions } from "../../types/marker/IMarkerIconOptions";

/**
 * TODO: replace static level with the dynamic ones.
 */
const LEVELS = [
    { level: -Infinity, suffix: "N/A", color: "#CCCCCC" },
    { level: 1, suffix: "", color: "#CCCCCC" },
    { level: 1e2, suffix: "K", color:  "#AAAAAA" },
    { level: 1e5, suffix: "M", color:  "#555555" },
    { level: 1e8, suffix: "B", color:  "#222222" },
    { level: 1e11, suffix: "t", color:  "#111111" },
];

/**
 * Definition of the marker options type.
 */
export type MarkerIconOptions = IMarkerIconOptions & {
    sizeBasic?: number;
    sizeGroup?: number;
    sizeDonut?: number;
}

/**
 * This class represents custom div icon which is used to mark center of countries.
 * It overrides L.DivIcon.
 * 
 * @author Jiri Hynek
 */
export class MarkerIcon extends Icon<IMarkerIconOptions> implements IMarkerIcon<IMarkerIconOptions> {

    private sizeBasic = 32;
    private sizeGroup = 36;
    private sizeDonut = 48;
    
    private svgLabel?: Selection<SVGTextElement, unknown, null, undefined>;
    private svgGroup?: Selection<SVGGElement, unknown, null, undefined>;

    public constructor(options: MarkerIconOptions) {
        super(options);

        // optional options
        if(options.sizeBasic) this.sizeBasic = options.sizeBasic;
        if(options.sizeGroup) this.sizeGroup = options.sizeGroup;
        if(options.sizeDonut) this.sizeDonut = options.sizeDonut;
    }

    protected round(value: number, align: number): number {
        return Math.round(value*align)/align;
    }

    protected formatValue(value: number, level: number): string {
        if(level == null || level < 0) {
            return LEVELS[0].suffix;
        } else {
            if(LEVELS[level].level === -Infinity) {
                return LEVELS[level].suffix;
            } else if(LEVELS[level].level == 1) {
                return this.round(value, LEVELS[level].level).toString();
            } else {
                value = value/(LEVELS[level].level*10);
                const align = (value >= 10) ? 1 : 10;
                return this.round(value, align) + LEVELS[level].suffix;
            }
        }
    }

    protected getColor(level: number): string {
        if(level == null || level < 0) {
            return LEVELS[0].color.toString();
        } else {
            return LEVELS[level].color.toString();
        }
    }

    protected getLevel(value: number): number {
        for(let i = LEVELS.length-1; i >= 0; i--) {
            if(value >= LEVELS[i].level) {
                return i;
            }
        }
        return -1;
    }

    protected getSize(): number {
        return this.options.useDonut ? this.sizeDonut : (this.options.isGroup ? this.sizeGroup : this.sizeBasic);
    }

    protected arc(size: number): Arc<unknown, PieArcDatum<number | { valueOf(): number; }>> {
        const arc = d3arc<d3.PieArcDatum<number | { valueOf(): number; }>>();
        return arc
            .innerRadius(size / 4 + 6)
            .outerRadius(size / 2);
    }

    protected getPieSubvalues(): PieArcDatum<number | { valueOf(): number; }>[] {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const pie = d3pie().value(function(d) { return (d as any)[1]; }).sort(null);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return pie(this.options.values.subvalues as any);
    }

    /**
     * It creates the icon. The method overrides the super method of Icon.
     * 
     * @param oldIcon 
     */
    public createIcon(oldIcon?: HTMLElement): HTMLElement {
        const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        const size = this.getSize();
        this.options.iconSize = [size,size];
        const center = size/2;
        this.options.iconAnchor = [center,center];
        const rCircle = this.sizeBasic/2;
        // moved to css
        //var strokeWidth = options.isGroup ? ((options.sizeGroup-options.sizeBasic)/2) : 0;
        const level = this.getLevel(options.values.value);

        const divContent = div.appendChild(document.createElement('div'));
        divContent.classList.value = 
            "leaflet-marker-level" + level // level
            + (options.isGroup ? " leaflet-marker-group" : "") // group of several markers
        ;

        // create SVG element
        const svg = d3select(divContent)
                    .append("svg")
                    .attr("width", size)
                    .attr("height", size);
        //svg.classList.add("leaflet-marker-item");

        // append circle
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
        this.svgLabel = svg.append("text")
            .html(this.formatValue(options.values.value, level))
            .attr("x", "50%")
            .attr("y", "50%")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("dy", "0.3em")
            .attr("font-family", "Arial");
            // moved to css
            //.attr("fill", "white")

        if(options.values.value != null && options.values.value != 0 && options.useDonut) {
            // donut chart
            this.svgGroup = svg.append("g")
                .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")");
            
            this.svgGroup
                .selectAll("path")
                .data(this.getPieSubvalues())
                .enter()
                .append("path")
                .attr("d", this.arc(size))
                .attr('class', (d) => { 
                    // get index of the data key in the list of categories and use this index to calculate the style
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    return "leaflet-marker-donut" + ((options.categories.findIndex((el) => el === (d as any).data[0])) % 3 + 1); }
                )
                // store the current data in the help variable
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                .each(function (d) { (this as any)._current = d; });
        }
        
        // private method of L.Icon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)._setIconStyles(div, 'icon');

        return div;
    }

    /**
     * It updates the data of the marker icon.
     * 
     * @param values 
     * @param animateOptions 
     */
    public updateData(values: IMarkerIconValueOptions, animateOptions: IDataChangeAnimateOptions): void {
        // update values
        this.options.values = values;

        if (this.svgLabel) {
            const level = this.getLevel(this.options.values.value);
            this.svgLabel.text(this.formatValue(this.options.values.value, level));
        }

        if (this.svgGroup) {
            const size = this.getSize();
            const arc = this.arc(size);
            this.svgGroup
                .selectAll("path")
                .data(this.getPieSubvalues())
                .transition()
                .delay(animateOptions.transitionDelay)
                .duration(animateOptions.transitionDuration)
                .attrTween("d", function(a) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const thisAny = (this as any);
                    const i = d3interpolate(thisAny._current, a);
                    thisAny._current = i(0);
                    return (t) => arc(i(t)) as string;
                });
        }
    }
}