class BarChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 20, bottom: 20, left: 40};
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

        // Scales and Axes
        vis.x = d3.scaleBand()
            .range([0, vis.width])
            .padding(0.1);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        // axis groups
        vis.xAxis = vis.svg.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate (0,${vis.height})`);

        vis.yAxis = vis.svg.append('g')
            .attr('class', 'axis y-axis');

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.x.domain()
        vis.y.domain()

        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.data)

        vis.xAxis
            .transition()
            .duration(800)
            .call(d3.axisBottom(vis.x))
        vis.yAxis
            .transition()
            .duration(800)
            .call(d3.axisLeft(vis.y))
    }

}