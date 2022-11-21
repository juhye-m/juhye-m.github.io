class DurationLineChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;


        this.initVis();

    }

    /*
     * Initialize visualization (static content; e.g. SVG area, axes, brush component)
     */

    initVis() {
        let vis = this;
        vis.margin = {top: 40, right: 40, bottom: 50, left: 50};
        //vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        //vis.height = document.getElementById(vis.parentElement).getBoundingClientRect().height - vis.margin.top - vis.margin.bottom;

        vis.width = 500
        vis.height = 500

        // init drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append('g')
            .attr('transform', `translate (${vis.margin.left}, ${vis.margin.top})`);

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'lineTooltip')

        // title
        vis.svg.append("text")
            .text("Average Top 100 Song Duration Over Time")
            .attr("transform", "translate(" + vis.width/2 + ",0)")
            .attr("text-anchor", "middle")

        vis.x = d3.scaleLinear()
            .range([0, vis.width]);
        vis.xAxis = d3.axisBottom()
            .scale(vis.x)
            .tickFormat(d3.format("d"))

        vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);
        vis.yAxis = d3.axisLeft()
            .scale(vis.y)
        vis.svg.append('g')
            .attr('class', 'axis y-axis');

        // axis labels
        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Year")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Average Duration of Top 100 Songs (s)")
            .attr("transform", "translate(-35, " + vis.height / 2 + ") rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        // Initialize line path
        vis.path1 = vis.svg.append('g')
            .append("path")


        // (Filter, aggregate, modify data)
        vis.wrangleData();
    }


    /*
     * Data wrangling
     */

    wrangleData() {
        let vis = this;
        // get average values for each year


        // Update the visualization
        vis.updateVis();
    }



    /*
     * The drawing function
     */

    updateVis() {
        let vis = this;

        // Update scale domains

        vis.x.domain([2010, 2021])
        vis.y.domain([0, d3.max(vis.data, d=>d.Duration)+20])

        // Update axes
        vis.svg.select(".y-axis")
            .transition()
            .duration(800)
            .call(vis.yAxis);
        vis.svg.select(".x-axis")
            .transition()
            .duration(800)
            .call(vis.xAxis);

        vis.path1
            .datum(vis.data)
            .attr("fill", "none")
            .attr("stroke", DARKGREEN)
            .attr("stroke-width", 2)
            .attr("d", d3.line()
                .x(function(d) {return vis.x(d.TopYear) })
                .y(function(d) {return vis.y(d.Duration) }))

    }
}