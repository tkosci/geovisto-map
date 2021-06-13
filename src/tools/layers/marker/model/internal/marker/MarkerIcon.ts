import {
    pie as d3pie,
    arc as d3arc,
    select as d3select
} from "d3";
import { Icon } from "leaflet";
import IMarkerIconOptions from "../../types/marker/IMarkerIconOptions";

/**
 * TODO: replace static level with the dynamic ones.
 */
const LEVELS = [
    [-Infinity, "N/A", "#CCCCCC"],
    [1, "", "#CCCCCC"],
    [1e2, "K", "#AAAAAA"],
    [1e5, "M", "#555555"],
    [1e8, "B", "#222222"],
    [1e11, "t", "#111111"],
];

/**
 * Help enum for indexation in the LEVELS const.
 */
enum LevelProp {
    LEVEL = 0,
    SUFFIX = 1,
    COLOR = 2
}

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
export class MarkerIcon extends Icon<MarkerIconOptions> {

    private sizeBasic = 32;
    private sizeGroup = 36;
    private sizeDonut = 48;

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
        if(level == undefined || level < 0) {
            return LEVELS[0][LevelProp.SUFFIX].toString();
        } else {
            if(LEVELS[level][LevelProp.LEVEL] == -Infinity) {
                return LEVELS[level][LevelProp.SUFFIX].toString();
            } else if(LEVELS[level][LevelProp.LEVEL] == 1) {
                return this.round(value, LEVELS[level][LevelProp.LEVEL] as number).toString();
            } else {
                value = value/(LEVELS[level][LevelProp.LEVEL] as number*10);
                const align = (value >= 10) ? 1 : 10;
                return this.round(value, align) + LEVELS[level][LevelProp.SUFFIX].toString();
            }
        }
    }

    protected getColor(level: number): string {
        if(level == null || level < 0) {
            return LEVELS[0][LevelProp.COLOR].toString();
        } else {
            return LEVELS[level][LevelProp.COLOR].toString();
        }
    }

    protected getLevel(value: number): number {
        for(let i = LEVELS.length-1; i >= 0; i--) {
            if(value > LEVELS[i][LevelProp.LEVEL]) {
                return i;
            }
        }
        return -1;
    }

    /**
     * It creates the icon. The method overrides the super method of Icon.
     * 
     * @param oldIcon 
     */
    public createIcon(oldIcon?: HTMLElement): HTMLElement {
        const div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
            options = this.options;

        const size = options.useDonut ? this.sizeDonut : (options.isGroup ? this.sizeGroup : this.sizeBasic);
        this.options.iconSize = [size,size];
        this.options.iconAnchor = [size/2,size/2];
        const rCircle = this.sizeBasic/2;
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
        const element = d3select(divContent);
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

        if(options.values.value != null && options.values.value != 0 && options.useDonut) {
            // moved to css
            //var color = d3.scaleOrdinal()
            //    .domain(options.values.subvalues)
            //    .range(this.donutColors);
            
            // ESLint disabled, any used
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const pie = d3pie().value(function(d) { return (d as any)[1]; });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const values_ready = pie(options.values.subvalues as any);
            
            // donut chart
            const arc = d3arc<d3.PieArcDatum<number | { valueOf(): number; }>>();
            svg.append("g")
                .attr("transform", "translate(" + size / 2 + "," + size / 2 + ")")
                .selectAll("abc")
                .data(values_ready)
                .enter()
                .append("path")
                .attr("d", arc
                    .innerRadius(size/4+6)
                    .outerRadius(size/2)
                )
                // moved to css
                .attr('class', function(d, i) { return "leaflet-marker-donut" + (i % 3 + 1); })
                //.attr('fill', function(d) { return(color(d.data.key)) })
                //.attr("stroke-width", "0px")
                //.attr("opacity", 0.8)
                ;
        }
        
        // private method of L.Icon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any)._setIconStyles(div, 'icon');

        return div;
    }
}