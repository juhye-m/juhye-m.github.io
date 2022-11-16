class Histogram {

    constructor(parentElement, data) {
        this.data = data
        this.parentElement = parentElement
        this.displayData = data
        this.countData = []

        this.initVis()
    }

    initVis() {
        let vis = this

        // create svg
        vis.margin = { top: 40, right: 0, bottom: 60, left: 60 };

        // vis.width = document.getElementById(vis.parentElement).getBoundingClientRect().width - vis.margin.left - vis.margin.right;
        // vis.height = 300 - vis.margin.top - vis.margin.bottom;

        vis.width = 500
        vis.height = 500

        // SVG drawing area
        vis.svg = d3.select("#" + vis.parentElement).append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + vis.margin.left + "," + vis.margin.top + ")");

        // Scales and axes
        vis.x = d3.scaleTime()
            .range([0, vis.width]);

        vis.y = d3.scaleLinear()
            .range([vis.height, 0]);

        vis.xAxis = d3.axisBottom()
            .scale(vis.x);

        vis.yAxis = d3.axisLeft()
            .scale(vis.y);

        vis.svg.append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + vis.height + ")");

        vis.svg.append("g")
            .attr("class", "y-axis axis");

        // wrangle data
        vis.wrangleData()
    }

    wrangleData() {
        let vis = this

        // filter and populate displayData


        // get the counts by year
        vis.getCountsByYear() // populates vis.countData using vis.displayData

        // update vis
        vis.updateVis()
    }

    updateVis() {
        let vis = this

        // Create domains for scales
        vis.x.domain(d3.extent(vis.countData, d => d.year))
        vis.y.domain(d3.extent(vis.countData, d => d.count))

        // Call axis functions with the new domain
        vis.svg.select(".x-axis").call(vis.xAxis);
        vis.svg.select(".y-axis").call(vis.yAxis);


    }

    // get the # songs released per year
    getCountsByYear() {
        let vis = this

        // create a map counting # songs by release date (in years)
        let map = d3.rollup(vis.displayData, v => v.length, d => d.ReleaseDate)

        // convert map to array and assign to displayData
        vis.countData = Array.from(map, ([year, count]) => ({ year, count }))

        console.log(vis.countData)
    }
}