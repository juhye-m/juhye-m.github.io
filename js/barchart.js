class BarChart {

    constructor(parentElement, data) {
        this.parentElement = parentElement;
        this.data = data;

        this.initVis()
    }

    initVis() {
        let vis = this;

        vis.margin = {top: 40, right: 40, bottom: 40, left: 40};
        vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;
        //vis.width = 500
        //vis.height = 500

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

        // title
        vis.svg.append("text")
            .text("Most Common Genres of Top 100 Songs")
            .attr("transform", "translate(" + vis.width/2 + ",0)")
            .attr("text-anchor", "middle")

        // axis labels
        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Count")
            .attr("transform", "translate(-35, " + vis.height / 2 + ") rotate(-90)")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        vis.svg.append("text")
            .attr("class", "axis-label")
            .text("Genre Type")
            .attr("transform", "translate(" + vis.width / 2 + ", " + (vis.height + 35) + ")")
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")

        vis.tooltip = d3.select("body").append('div')
            .attr('class', "tooltip")
            .attr('id', 'barTooltip')

        this.wrangleData();
    }

    wrangleData() {
        let vis = this;

        vis.updateVis()
    }

    updateVis() {
        let vis = this;

        vis.x.domain(vis.data.map(d => d.Genre))
        vis.y.domain([0, 432])

        vis.bars = vis.svg.selectAll(".bar")
            .data(vis.data)

        vis.bars.exit().remove();
console.log(vis.data)
        vis.bars
            .enter()
            .append("rect")
            .attr("class", "bar")
            .merge(vis.bars)
            .attr("x", d => vis.x(d.Genre))
            .attr("height", d => vis.height - vis.y(d.Count))
            .attr("y", d => vis.y(d.Count))
            .attr("width", vis.x.bandwidth())
            .attr("fill", "green" )


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